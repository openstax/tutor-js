import loadjs from 'loadjs';
import Raven from './raven';
import Flags from '../feature_flags';

function onLoadFailure() {
  Raven.log('Failed to load PulseInsights script');
}

class PI {
  commands = [
    ['identify', 'PI-16384954'],
    ['get', 'surveys'],
  ];
}

export default {
  boot() {
    if (!Flags.pulse_insights) {
      return Promise.resolve({});
    }
    window.pi = new PI();
    return loadjs('//js.pulseinsights.com/surveys.js', {
      error: onLoadFailure,
    });
  },
};
