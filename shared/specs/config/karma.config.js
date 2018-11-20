import webpack from 'webpack';
import commonConfig from './karma.common';

export default function(config) {
  return config.set(commonConfig);
}
