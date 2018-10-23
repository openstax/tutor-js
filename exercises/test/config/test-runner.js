import _ from 'underscore';
//gulpKarma = require 'gulp-karma'
import Karma from 'karma';
import gulp from 'gulp';
import gutil from 'gulp-util';
import moment from 'moment';
import path from 'path';
import { spawn } from 'child_process';
import fileExists from 'file-exists';
_ = require('underscore');

class TestRunner {
  static initClass() {
  
    this.prototype.isKarmaRunning = false;
  
    this.prototype.pendingSpecs = [];
  }

  runKarma() {
    const specs = _.unique(this.pendingSpecs);

    // no need to start a server if there are no pending specs, or the spec list hasn't changed
    if (_.isEmpty(this.pendingSpecs)) { return; }
    if (_.isEqual(this.curSpecs != null ? this.curSpecs.sort() : undefined, specs.sort())) {
      this.pendingSpecs = [];
      return;
    }

    // if there's already a karma instance running, then kill it, since we're starting a new one
    if (this.isKarmaRunning && this.child) {
      process.kill(this.child.pid, 'SIGTERM');
      this.child = null;
    }

    this.isKarmaRunning = true;
    gutil.log('[specs]', gutil.colors.green(`testing ${specs.join(' ')}`));
    this.pendingSpecs = [];
    const startAt = moment();

    this.child = spawn(
      'node',
      [
        path.join(__dirname, 'karma-in-background.js'),
        JSON.stringify(specs),
      ],
      { stdio: 'inherit' },
    );

    //save the spec list that is being run
    this.curSpecs = specs.slice();

    return this.child.on('exit', exitCode => {
      this.isKarmaRunning = false;
      const duration = moment.duration(moment().diff(startAt));
      const elapsed = `${duration.minutes()}:${duration.seconds()}`;
      return gutil.log('[test]', gutil.colors.green(`done. ${specs.length} specs in ${elapsed}`));
    });
  }

  onFileChange(change) {
    if (change.relative.match(/^src/)) {
      const testPath = change.relative.replace('src', 'test');
      testPath.replace(/\.(\w+)$/, '.spec.coffee');
      const spec = testPath.replace(/\.(\w+)$/, '.spec.coffee');
      const existingSpecs = _.select([
        testPath.replace(/\.(\w+)$/, '.spec.cjsx'),
        testPath.replace(/\.(\w+)$/, '.spec.coffee'),
      ], fileExists);
      if (_.isEmpty(existingSpecs)) {
        gutil.log('[change]', gutil.colors.red(`no spec was found for ${change.relative}`));
      } else {
        this.pendingSpecs.push(...Array.from(existingSpecs || []));
      }
    } else {
      this.pendingSpecs.push(change.relative);
    }
    if (this.pendingSpecs.length) { gutil.log('[test]', gutil.colors.green(`pending: ${this.pendingSpecs.join(' ')}`)); }
    return this.runKarma();
  }
}
TestRunner.initClass();

export default TestRunner;
