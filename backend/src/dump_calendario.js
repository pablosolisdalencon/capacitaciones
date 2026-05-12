const xlsx = require('xlsx');
const path = require('path');

const file = 'd:\\EPIC\\capacitaciones\\info\\Programa_Capacitaciones_2026.xlsx';

try {
  const workbook = xlsx.readFile(file);
  const sheet = workbook.Sheets['📅 Calendario Sesiones'];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  console.log(data.slice(0, 20)); // Dump first 20 rows
} catch (err) {
  console.error('Error:', err.message);
}
