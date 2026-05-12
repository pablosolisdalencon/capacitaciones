const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const file1 = 'd:\\EPIC\\capacitaciones\\info\\Plan Capacitacion Grupo Oval 2026 .xlsx';
const file2 = 'd:\\EPIC\\capacitaciones\\info\\Programa_Capacitaciones_2026.xlsx';

function excelToDate(excelDate) {
  if (!excelDate) return null;
  if (typeof excelDate === 'number') {
    const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
    return date.toISOString().split('T')[0];
  }
  if (typeof excelDate === 'string' && excelDate.includes(' de ')) {
    // Parse "7 de mayo" -> 2026-05-07
    const months = {
      'mayo': '05', 'junio': '06', 'julio': '07', 'agosto': '08',
      'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
    };
    const parts = excelDate.split(' de ');
    const day = parts[0].padStart(2, '0');
    const month = months[parts[1].toLowerCase()] || '01';
    return `2026-${month}-${day}`;
  }
  return null;
}

function extractData() {
  const data = {
    trainings: [],
    workers: [],
    talks: [],
    serviceAssignments: {}
  };

  // 1. Read Plan Capacitacion Grupo Oval 2026 .xlsx
  try {
    const wb1 = xlsx.readFile(file1);
    const listSheet = wb1.Sheets['📋 Listado de capacitaciones'];
    if (listSheet) {
      const listData = xlsx.utils.sheet_to_json(listSheet, { header: 1 });
      const headers = listData[3];
      for (let i = 4; i < listData.length; i++) {
        const row = listData[i];
        if (row[1]) {
          data.trainings.push({
            name: row[1],
            service: row[2],
            date: excelToDate(row[3]),
            speaker: row[4],
            description: row[5] || ''
          });
        }
      }
    }
  } catch (err) {
    console.error('Error reading file 1:', err.message);
  }

  // 2. Read Programa_Capacitaciones_2026.xlsx
  try {
    const wb2 = xlsx.readFile(file2);
    
    // 2.1 Calendario Sesiones
    const calSheet = wb2.Sheets['📅 Calendario Sesiones'];
    if (calSheet) {
      const calData = xlsx.utils.sheet_to_json(calSheet, { header: 1 });
      for (let i = 4; i < calData.length; i++) {
        const row = calData[i];
        if (row[0] && typeof row[0] === 'number') { // Valid row with N°
          const trainingName = row[5];
          const date = excelToDate(row[2]) || excelToDate(row[1]); // Try date or month
          if (trainingName && date) {
            data.talks.push({
              trainingName,
              date,
              speaker: row[7],
              modality: row[8],
              duration: row[9]
            });
          }
        }
      }
    }

    // 2.2 Detalle por Capacitación
    const trainSheet = wb2.Sheets['📚 Detalle por Capacitación'];
    if (trainSheet) {
      const trainData = xlsx.utils.sheet_to_json(trainSheet, { header: 1 });
      for (let i = 4; i < trainData.length; i++) {
        const row = trainData[i];
        if (row[1]) {
          const existing = data.trainings.find(t => t.name === row[1]);
          if (existing) {
            existing.type = row[9]; // Corporativa, etc.
            if (!existing.speaker) existing.speaker = row[8];
          } else {
            data.trainings.push({
              name: row[1],
              speaker: row[8],
              type: row[9],
              description: row[10] || ''
            });
          }
        }
      }
    }

    // 2.3 Por Servicio
    const servSheet = wb2.Sheets['🏢 Por Servicio'];
    if (servSheet) {
      const servData = xlsx.utils.sheet_to_json(servSheet, { header: 1 });
      let currentService = '';
      for (let i = 2; i < servData.length; i++) {
        const row = servData[i];
        if (row[0] && typeof row[0] === 'string' && row[0].includes(' — ')) {
          currentService = row[0].split(' — ')[0].trim();
          if (!data.serviceAssignments[currentService]) data.serviceAssignments[currentService] = [];
        } else if (row[0] && typeof row[0] === 'number' && currentService) {
          data.serviceAssignments[currentService].push(row[1]); // Training Name
        }
      }
    }

    // 2.4 Detalle por Colaborador (To get workers)
    const workerSheet = wb2.Sheets['👥 Detalle por Colaborador'];
    if (workerSheet) {
      const workerData = xlsx.utils.sheet_to_json(workerSheet, { header: 1 });
      for (let i = 4; i < workerData.length; i++) {
        const row = workerData[i];
        if (row[1] && typeof row[0] === 'number') {
          data.workers.push({
            name: row[1],
            service: row[2],
            rut: row[3]
          });
        }
      }
    }

  } catch (err) {
    console.error('Error reading file 2:', err.message);
  }

  fs.writeFileSync(path.join(__dirname, 'consolidated_data.json'), JSON.stringify(data, null, 2));
  console.log('Data consolidated to consolidated_data.json');
  console.log(`Trainings: ${data.trainings.length}`);
  console.log(`Workers: ${data.workers.length}`);
  console.log(`Talks scheduled: ${data.talks.length}`);
  console.log(`Services with assignments: ${Object.keys(data.serviceAssignments).length}`);
}

extractData();
