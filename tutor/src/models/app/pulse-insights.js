import loadjs from 'loadjs';
import Raven from './raven';

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
    window.pi = new PI();
    return loadjs('//js.pulseinsights.com/surveys.js', {
      error: onLoadFailure,
    });
  },
};
