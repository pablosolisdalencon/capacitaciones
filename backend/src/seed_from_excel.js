const { sequelize, User, Service, Specialty, Training, Speaker, Worker, Talk } = require('./models');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function seed() {
  await sequelize.sync({ force: true }); // WARNING: This will clear the DB!

  // Create Users
  const salt = await bcrypt.genSalt(10);
  const hashedAdminPassword = await bcrypt.hash('password123', salt);
  const hashedOperatorPassword = await bcrypt.hash('pssword123', salt);

  await User.create({ name: 'Admin', email: 'admin@test.com', password: hashedAdminPassword, role: 'Admin' });
  await User.create({ name: 'Operador', email: 'operador@test.com', password: hashedOperatorPassword, role: 'Operador' });

  const workersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'workers.json')));
  const trainingsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'trainings.json')));

  // 1. Create Services
  const serviceNames = [...new Set(workersData.map(w => w.Servicio).filter(Boolean))];
  if (!serviceNames.includes('Corporativo')) serviceNames.push('Corporativo');
  if (!serviceNames.includes('Transversal')) serviceNames.push('Transversal');
  
  const services = {};
  for (const name of serviceNames) {
    services[name] = await Service.create({ name });
  }

  // 2. Create Default Specialties
  const specialties = {};
  for (const name of serviceNames) {
    specialties[name] = await Specialty.create({ name: `General ${name}`, ServiceId: services[name].id });
  }

  // 3. Create Speakers
  const speakerNames = [...new Set(trainingsData.map(t => t.Responsable).filter(Boolean))];
  const speakers = {};
  for (const name of speakerNames) {
    speakers[name] = await Speaker.create({ name });
  }

  // 4. Create Trainings
  const trainings = {};
  for (const t of trainingsData) {
    const serviceNamesInvolved = t['Servicios involucrados']?.split(',').map(s => s.trim()).filter(Boolean) || [];
    const serviceName = serviceNamesInvolved[0];
    const specialty = specialties[serviceName] || specialties[Object.keys(specialties)[0]]; // Fallback
    
    const training = await Training.create({
      name: t['Capacitación'],
      description: t['Observaciones'] || '',
      duration: 2, // Default duration
      isCertified: t['Tipo de sesión'] === 'Corporativa',
      SpecialtyId: specialty ? specialty.id : null
    });
    
    trainings[t['Capacitación']] = training;

    // Associate with all services involved
    for (const sName of serviceNamesInvolved) {
      const service = services[sName];
      if (service) {
        await training.addService(service);
      }
    }
  }

  // 5. Create Workers
  for (const w of workersData) {
    const service = services[w.Servicio];
    await Worker.create({
      name: w.Colaborador,
      rut: w.RUT !== '—' ? w.RUT : `TEMP-${Math.random().toString().slice(2, 10)}`, // Handle empty RUT
      ServiceId: service ? service.id : null
    });
  }

  // 6. Create Talks
  const months = {
    'Mayo': '05', 'Junio': '06', 'Julio': '07', 'Agosto': '08',
    'Septiembre': '09', 'Octubre': '10', 'Noviembre': '11', 'Diciembre': '12'
  };
  for (const t of trainingsData) {
    const training = trainings[t['Capacitación']];
    const speaker = speakers[t['Responsable']];
    const monthStr = t['Mes\nprogramado'];
    const month = months[monthStr] || '01';
    const date = `2026-${month}-01`;
    const spots = t['Total\nasignados'] || 30;

    if (training && speaker) {
      await Talk.create({
        date: date,
        spots: spots,
        status: 'Programada',
        TrainingId: training.id,
        SpeakerId: speaker.id
      });
    }
  }

  console.log('Database seeded successfully from Excel data!');
}

seed().catch(console.error);
