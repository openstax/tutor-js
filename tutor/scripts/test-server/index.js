const { bind } = require('lodash');
const path = require('path');
const fork = require('child_process').fork;
const chalk = require('chalk');
const { fe_port, be_port } = require('./ports');
const SERVERS = ['backend', 'frontend'];

class Server {

  constructor({
    role = 'teacher',
    ports = { frontend: fe_port, backend: be_port },
  } = {}) {
    this.role = role;
    this.ports = ports;
    this.pending = {};
  }

  boot() {
    // eslint-disable-next-line no-console
    console.log(chalk.green(
      `\nStarting servers on port FE: ${this.ports.frontend}; BE: ${this.ports.backend}`
    ));
    // eslint-disable-next-line no-console
    console.log(chalk.green(`Role: ${this.role}`));

    return this._booting = Promise.all(SERVERS.map((server) =>
      new Promise((resolve, reject) => {
        this.pending[server] = { resolve, reject };
        this[server] = fork(
          path.join(__dirname, `./${server}.js`),
          ['--fe', this.ports.frontend, '--be', this.ports.backend], {},
        );
        this[server].on('message', bind(this._onMessage, this, server));
        this[server].on('close', bind(this._onServerExit, this, server));
      })
    )).then(() => {
      delete this._booting;
      this.setRole(this.role);
      return this;
    });
  }

  _onMessage(server, msg) {
    if (msg.READY) { this.pending[server].resolve(); }
    if (msg.FAILED) { this.pending[server].reject(); }
  }

  _onServerExit(server, status) {
    this.pending[server].resolve(status);
  }

  setRole(role) {
    this.role = role;
    return Promise.all(SERVERS.map((server) =>
      new Promise((resolve) => this[server].send({ role }, resolve))
    ));
  }

  ready() {
    return this._booting || Promise.resolve(this);
  }

  halt() {
    return Promise.all(SERVERS.map((server) =>
      new Promise((resolve) => {
        if (this[server]) {
          this[server].on('close', resolve);
          this[server].kill('SIGINT');
        } else {
          resolve();
        }
      })
    ));
  }

  get url() {
    return `http://localhost:${this.ports.frontend}`;
  }

}


if (require.main === module) {
  const argv = require('yargs').argv;
  const server = new Server({ role: argv.role || 'teacher' });
  server.boot();
} else {
  module.exports = Server;
}
