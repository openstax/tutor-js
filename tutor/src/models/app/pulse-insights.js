import loadjs from 'loadjs';
import Raven from './raven';
import Flags from '../feature_flags';

export default {
  boot() {
    if (!Flags.pulse_insights) {
      return Promise.resolve({});
    }
    const w = window;
    w.pi = function() {
      w.pi.commands = (w.pi.commands || []);
      w.pi.commands.push(arguments);
    };
    w.pi('identify', 'PI-16384954');
    w.pi('get', 'surveys');

    return loadjs('//js.pulseinsights.com/surveys.js', {
      async: true,
      returnPromise: true,
      error: () => Raven.log('Failed to load PulseInsights script'),
    });
  },
};
