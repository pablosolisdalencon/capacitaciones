const xlsx = require('xlsx');
const path = require('path');

const file1 = 'd:\\EPIC\\capacitaciones\\info\\Plan Capacitacion Grupo Oval 2026 .xlsx';
const file2 = 'd:\\EPIC\\capacitaciones\\info\\Programa_Capacitaciones_2026.xlsx';

function inspect(filePath) {
  console.log(`\nInspecting: ${filePath}`);
  try {
    const workbook = xlsx.readFile(filePath);
    console.log('Sheets:', workbook.SheetNames);
  } catch (err) {
    console.error('Error reading file:', err.message);
  }
}

inspect(file1);
inspect(file2);
