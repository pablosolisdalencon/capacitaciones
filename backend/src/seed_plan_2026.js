const { sequelize, User, Service, Specialty, Training, Speaker, Worker, Talk, Request } = require('./models');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function seed() {
  await sequelize.sync({ force: true }); // WARNING: This will clear the DB!

  // Read consolidated data
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'consolidated_data.json')));

  // 1. Create Users
  const salt = await bcrypt.genSalt(10);
  const hashedAdminPassword = await bcrypt.hash('password123', salt);
  const hashedOperatorPassword = await bcrypt.hash('pssword123', salt);

  await User.create({ name: 'Admin', email: 'admin@test.com', password: hashedAdminPassword, role: 'Admin' });
  await User.create({ name: 'Operador', email: 'operador@test.com', password: hashedOperatorPassword, role: 'Operador' });

  // 2. Create Services
  const services = {};
  const serviceNames = [...new Set([
    ...data.workers.map(w => w.service).filter(Boolean),
    ...Object.keys(data.serviceAssignments),
    'Corporativo', 'Transversal'
  ])];

  for (const name of serviceNames) {
    services[name] = await Service.create({ name });
  }

  // Create default specialty for fallback
  const defaultSpecialty = await Specialty.create({ name: 'General', ServiceId: services['Corporativo'].id });

  // 3. Create Speakers
  const speakers = {};
  const speakerNames = [...new Set([
    ...data.trainings.map(t => t.speaker).filter(Boolean),
    ...data.talks.map(t => t.speaker).filter(Boolean)
  ])];

  for (const name of speakerNames) {
    // Handle split speakers like "Nicolás Córdova / Víctor Oliva" -> take the first one or create as is
    speakers[name] = await Speaker.create({ name });
  }
  
  const defaultSpeaker = await Speaker.create({ name: 'Relator Interno' });

  // 4. Create Trainings
  const trainings = {};
  for (const t of data.trainings) {
    trainings[t.name] = await Training.create({
      name: t.name,
      description: t.description || '',
      duration: 2,
      isCertified: t.type === 'Corporativa' || t.type === 'Certificaciones ISO',
      SpecialtyId: defaultSpecialty.id
    });
  }

  // 5. Assign Trainings to Services (from sheet "Por Servicio")
  for (const serviceName of Object.keys(data.serviceAssignments)) {
    const service = services[serviceName];
    const trainingNames = data.serviceAssignments[serviceName];
    if (service) {
      for (const tName of trainingNames) {
        const training = trainings[tName];
        if (training) {
          await service.addTraining(training);
        }
      }
    }
  }

  // Assign Corporativa trainings to "Corporativo" service
  const corpService = services['Corporativo'];
  for (const t of data.trainings) {
    if (t.type === 'Corporativa' && corpService) {
      const training = trainings[t.name];
      if (training) {
        await corpService.addTraining(training);
      }
    }
  }

  // 6. Create Workers
  const workers = {};
  for (const w of data.workers) {
    const service = services[w.service] || services['Corporativo']; // Fallback to Corporativo
    const worker = await Worker.create({
      name: w.name,
      rut: (!w.rut || w.rut === '—') ? `TEMP-${Math.random().toString().slice(2, 10)}` : w.rut,
      ServiceId: service ? service.id : null
    });
    workers[w.name] = worker;
  }

  // 7. Create Talks and Requests
  for (const talkData of data.talks) {
    const training = trainings[talkData.trainingName];
    const speaker = speakers[talkData.speaker] || defaultSpeaker;
    
    if (training) {
      const talk = await Talk.create({
        date: talkData.date,
        spots: 35,
        status: 'Programada',
        TrainingId: training.id,
        SpeakerId: speaker.id
      });

      // Create requests for workers in the services assigned to this training
      // For simplicity, let's create requests for ALL workers if it's Corporativa,
      // or for workers in the specific services if listed in data.serviceAssignments
      
      const isCorp = data.trainings.find(t => t.name === talkData.trainingName)?.type === 'Corporativa';
      
      for (const wName of Object.keys(workers)) {
        const worker = workers[wName];
        const wData = data.workers.find(w => w.name === wName);
        
        let shouldAssign = isCorp;
        
        if (!shouldAssign && wData && wData.service) {
          const assignedTrainings = data.serviceAssignments[wData.service] || [];
          if (assignedTrainings.includes(talkData.trainingName)) {
            shouldAssign = true;
          }
        }

        if (shouldAssign) {
          await Request.create({
            status: 'Pendiente',
            type: 'Inscripcion',
            WorkerId: worker.id,
            TalkId: talk.id
          });
        }
      }
    }
  }

  console.log('Database seeded successfully with consolidated data!');
}

seed().catch(console.error);
