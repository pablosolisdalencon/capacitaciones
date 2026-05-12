const XLSX = require('xlsx');
const path = require('path');

const file1 = path.join(__dirname, '../../info/Plan Capacitacion Grupo Oval 2026 .xlsx');
const file2 = path.join(__dirname, '../../info/Programa_Capacitaciones_2026.xlsx');

function readExcel(filePath) {
  console.log(`\nReading: ${filePath}`);
  const workbook = XLSX.readFile(filePath);
  const sheetNames = workbook.SheetNames;
  console.log('Sheets:', sheetNames);
  
  sheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    console.log(`\nSheet: ${sheetName}`);
    console.log('Rows:', data.slice(0, 5)); // Print first 5 rows
  });
}

try {
  readExcel(file1);
} catch (e) { console.error('Error file 1:', e.message); }

try {
  readExcel(file2);
} catch (e) { console.error('Error file 2:', e.message); }
