const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../info/Plan Capacitacion Grupo Oval 2026 .xlsx');
const workbook = XLSX.readFile(filePath);

// 1. Extract Trainings from "📋 Listado de capacitaciones"
const trainingSheet = workbook.Sheets['📋 Listado de capacitaciones'];
const trainingData = XLSX.utils.sheet_to_json(trainingSheet, { header: 1 });

const trainings = [];
// Find header row
let trHeaderIndex = -1;
for (let i = 0; i < trainingData.length; i++) {
  if (trainingData[i] && trainingData[i].includes('Nombre de Capacitación')) {
    trHeaderIndex = i;
    break;
  }
}

if (trHeaderIndex !== -1) {
  const headers = trainingData[trHeaderIndex];
  for (let i = trHeaderIndex + 1; i < trainingData.length; i++) {
    const row = trainingData[i];
    if (row && row[1]) { // If has name
      const training = {};
      headers.forEach((header, index) => {
        training[header] = row[index];
      });
      trainings.push(training);
    }
  }
}

console.log(`Extracted ${trainings.length} trainings from list.`);

// 2. Extract Workers and Assignments from "Detalle Personal"
const workerSheet = workbook.Sheets['Detalle Personal'];
const workerData = XLSX.utils.sheet_to_json(workerSheet, { header: 1 });

const workers = [];
const assignments = []; // { workerRut, trainingName, applies, date, status }

// Find header row (row 2 contains training names, row 3 contains Aplica/Fecha/Estado)
let headerRowIndex = -1;
for (let i = 0; i < workerData.length; i++) {
  if (workerData[i] && workerData[i].includes('Nombre Completo')) {
    headerRowIndex = i;
    break;
  }
}

if (headerRowIndex !== -1) {
  const trainingHeaders = workerData[headerRowIndex];
  const subHeaders = workerData[headerRowIndex + 1];
  
  for (let i = headerRowIndex + 2; i < workerData.length; i++) {
    const row = workerData[i];
    if (row && row[2]) { // If has name
      const worker = {
        name: row[2],
        rut: row[3],
        service: row[1]
      };
      workers.push(worker);
      
      // Process matrix
      for (let j = 4; j < row.length; j += 3) {
        const trainingNameWithId = trainingHeaders[j];
        if (trainingNameWithId) {
          const applies = row[j];
          const date = row[j + 1];
          const status = row[j + 2];
          
          if (applies === 'Aplica') {
            assignments.push({
              workerRut: worker.rut,
              trainingName: trainingNameWithId.replace(/^\[\d+\]\s*/, ''), // Remove [1]
              date: date,
              status: status
            });
          }
        }
      }
    }
  }
}

console.log(`Extracted ${workers.length} workers.`);
console.log(`Extracted ${assignments.length} assignments.`);

// Save to JSON
fs.writeFileSync(path.join(__dirname, 'extracted_trainings.json'), JSON.stringify(trainings, null, 2));
fs.writeFileSync(path.join(__dirname, 'extracted_workers.json'), JSON.stringify(workers, null, 2));
fs.writeFileSync(path.join(__dirname, 'extracted_assignments.json'), JSON.stringify(assignments, null, 2));

console.log('Data saved to JSON files.');
