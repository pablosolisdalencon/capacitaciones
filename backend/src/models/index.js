const sequelize = require('../config/database');
const User = require('./User');
const Service = require('./Service');
const Specialty = require('./Specialty');
const Training = require('./Training');
const Talk = require('./Talk');
const Worker = require('./Worker');
const Request = require('./Request');
const Evaluation = require('./Evaluation');
const Speaker = require('./Speaker');

// Asociaciones
Service.hasMany(Specialty);
Specialty.belongsTo(Service);

Specialty.hasMany(Training);
Training.belongsTo(Specialty);

// Many-to-Many associations
Service.belongsToMany(Training, { through: 'ServiceTrainings' });
Training.belongsToMany(Service, { through: 'ServiceTrainings' });

Worker.belongsToMany(Training, { through: 'WorkerTrainings' });
Training.belongsToMany(Worker, { through: 'WorkerTrainings' });

Training.hasMany(Talk);
Talk.belongsTo(Training);

Speaker.hasMany(Talk);
Talk.belongsTo(Speaker);

Service.hasMany(Worker);
Worker.belongsTo(Service);

// Solicitudes de inscripción
Worker.hasMany(Request);
Request.belongsTo(Worker);

Talk.hasMany(Request);
Request.belongsTo(Talk);

// Evaluaciones
Worker.hasMany(Evaluation);
Evaluation.belongsTo(Worker);

Talk.hasMany(Evaluation);
Evaluation.belongsTo(Talk);

module.exports = {
  sequelize,
  User,
  Service,
  Specialty,
  Training,
  Talk,
  Worker,
  Request,
  Evaluation,
  Speaker,
};
