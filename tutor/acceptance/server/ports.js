const fe_port = process.argv[2] || '8000';
const be_port = process.argv[3] || '8001';

module.exports = { fe_port, be_port };
