const fs = require('fs');
const path = require('path');

const workers = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_workers.json')));
const trainings = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_trainings.json')));
const assignments = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_assignments.json')));

// Helper to convert Excel date to JS Date string
function excelToDate(excelDate) {
  if (!excelDate || typeof excelDate !== 'number') return null;
  const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
  return date.toISOString().split('T')[0];
}

// 1. Map Trainings by Name
const trainingMap = {};
trainings.forEach(t => {
  trainingMap[t['Nombre de Capacitación']] = {
    ...t,
    date: excelToDate(t.Fecha)
  };
});

// 2. Group Workers by Service
const serviceWorkers = {};
workers.forEach(w => {
  const service = w.service || 'Sin Servicio';
  if (!serviceWorkers[service]) serviceWorkers[service] = [];
  serviceWorkers[service].push(w);
});

// 3. Count assignments per training in each service
const serviceTrainingCounts = {}; // { service: { trainingName: count } }
assignments.forEach(a => {
  const worker = workers.find(w => w.rut === a.workerRut || w.name === a.workerRut); // Fallback to name if RUT missing
  if (worker) {
    const service = worker.service || 'Sin Servicio';
    if (!serviceTrainingCounts[service]) serviceTrainingCounts[service] = {};
    if (!serviceTrainingCounts[service][a.trainingName]) serviceTrainingCounts[service][a.trainingName] = 0;
    serviceTrainingCounts[service][a.trainingName]++;
  }
});

// 4. Determine Common Trainings per Service
const commonServiceTrainings = {}; // { service: [trainingName] }
const threshold = 0.8; // 80%

Object.keys(serviceWorkers).forEach(service => {
  const totalWorkers = serviceWorkers[service].length;
  commonServiceTrainings[service] = [];
  
  const counts = serviceTrainingCounts[service] || {};
  Object.keys(counts).forEach(trainingName => {
    if (counts[trainingName] / totalWorkers >= threshold) {
      commonServiceTrainings[service].push(trainingName);
    }
  });
});

// 5. Filter Individual Assignments (Not common)
const individualAssignments = assignments.filter(a => {
  const worker = workers.find(w => w.rut === a.workerRut || w.name === a.workerRut);
  if (!worker) return true; // Keep if worker not found for some reason
  const service = worker.service || 'Sin Servicio';
  const commons = commonServiceTrainings[service] || [];
  return !commons.includes(a.trainingName);
});

// 6. Handle "TODOS" (Corporativo) Trainings
const corporativoTrainings = [];
trainings.forEach(t => {
  if (t.Servicio === 'TODOS') {
    corporativoTrainings.push(t['Nombre de Capacitación']);
  }
});

// Save processed data
const finalData = {
  services: Object.keys(serviceWorkers),
  commonServiceTrainings,
  individualAssignments,
  corporativoTrainings,
  trainingDetails: trainingMap,
  workers
};

fs.writeFileSync(path.join(__dirname, 'seed_data.json'), JSON.stringify(finalData, null, 2));

console.log('Processed Data:');
console.log(`Services: ${Object.keys(serviceWorkers).length}`);
console.log(`Common assignments (Services): ${Object.values(commonServiceTrainings).reduce((a, b) => a + b.length, 0)}`);
console.log(`Individual assignments: ${individualAssignments.length}`);
console.log(`Corporativo trainings: ${corporativoTrainings.length}`);
