const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../../info/Plan Capacitacion Grupo Oval 2026 .xlsx');
const workbook = XLSX.readFile(filePath);

console.log('Sheet Names:', workbook.SheetNames);

workbook.SheetNames.forEach(sheetName => {
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  console.log(`\nSheet: ${sheetName}`);
  console.log('Rows:', data.length);
  console.log('First 5 rows:');
  console.log(data.slice(0, 5));
});
