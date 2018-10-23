import { webpack } from './karma.common';
import _ from 'underscore';
import commonConfig from './karma.common';

export default function(karmaConfig) {

  const config = _.extend({
    // usefull for debugging Karma config
    // logLevel: karmaConfig.LOG_DEBUG

    coverageReporter: {
      type: 'text',
    },
  }, commonConfig);

  config.reporters.push('coverage');

  for (let spec in config.preprocessors) {
    const processors = config.preprocessors[spec];
    processors.push('coverage');
  }

  config.webpack.module.postLoaders = [{
    test: /\.(cjsx|coffee)$/,
    loader: 'istanbul-instrumenter',
    exclude: /(test|node_modules|resources|bower_components)/,
  }];

  config.plugins.push(
    require('karma-coverage')
  );

  return karmaConfig.set(config);
}
