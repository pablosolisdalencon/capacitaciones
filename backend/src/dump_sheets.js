const xlsx = require('xlsx');
const path = require('path');

const file = 'd:\\EPIC\\capacitaciones\\info\\Programa_Capacitaciones_2026.xlsx';

function dumpSheet(workbook, sheetName) {
  console.log(`\n--- Sheet: ${sheetName} ---`);
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    console.log('Not found');
    return;
  }
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  console.log(data.slice(0, 5)); // Dump first 5 rows
}

try {
  const workbook = xlsx.readFile(file);
  dumpSheet(workbook, '📅 Calendario Sesiones');
  dumpSheet(workbook, '👥 Detalle por Colaborador');
  dumpSheet(workbook, '📚 Detalle por Capacitación');
  dumpSheet(workbook, '🏢 Por Servicio');
  dumpSheet(workbook, '📋 Mayo');
} catch (err) {
  console.error('Error:', err.message);
}
