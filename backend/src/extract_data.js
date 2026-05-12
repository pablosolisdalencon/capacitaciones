const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../info/Programa_Capacitaciones_2026.xlsx');
const workbook = XLSX.readFile(filePath);

console.log('Sheet Names:', workbook.SheetNames);

const workerSheet = workbook.Sheets['👥 Detalle por Colaborador'];
if (!workerSheet) console.log('Worker sheet not found!');
const workerData = XLSX.utils.sheet_to_json(workerSheet, { header: 1 });
console.log('Worker Data rows:', workerData.length);

let headerRowIndex = -1;
for (let i = 0; i < workerData.length; i++) {
  if (workerData[i] && workerData[i].includes('Colaborador')) {
    headerRowIndex = i;
    console.log('Found Colaborador at row', i);
    break;
  }
}

const workers = [];
if (headerRowIndex !== -1) {
  const headers = workerData[headerRowIndex];
  for (let i = headerRowIndex + 1; i < workerData.length; i++) {
    const row = workerData[i];
    if (row && row[1]) { // If has name
      const worker = {};
      headers.forEach((header, index) => {
        worker[header] = row[index];
      });
      workers.push(worker);
    }
  }
}

const trainingSheet = workbook.Sheets['📚 Detalle por Capacitación'];
if (!trainingSheet) console.log('Training sheet not found!');
const trainingData = XLSX.utils.sheet_to_json(trainingSheet, { header: 1 });
console.log('Training Data rows:', trainingData.length);

let trHeaderIndex = -1;
for (let i = 0; i < trainingData.length; i++) {
  if (trainingData[i] && trainingData[i].includes('Capacitación')) {
    trHeaderIndex = i;
    console.log('Found Capacitación at row', i);
    break;
  }
}

const trainings = [];
if (trHeaderIndex !== -1) {
  const headers = trainingData[trHeaderIndex];
  for (let i = trHeaderIndex + 1; i < trainingData.length; i++) {
    const row = trainingData[i];
    if (row && row[1]) {
      const training = {};
      headers.forEach((header, index) => {
        training[header] = row[index];
      });
      trainings.push(training);
    }
  }
}

fs.writeFileSync(path.join(__dirname, 'workers.json'), JSON.stringify(workers, null, 2));
fs.writeFileSync(path.join(__dirname, 'trainings.json'), JSON.stringify(trainings, null, 2));

console.log(`Extracted ${workers.length} workers and ${trainings.length} trainings.`);
