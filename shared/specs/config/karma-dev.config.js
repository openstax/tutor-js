import { webpack } from './karma.common';
import _ from 'underscore';
import commonConfig from './karma.common';

export default function(karmaConfig) {

  const config = _.extend(
    commonConfig,
    {
      browsers: [process.env.KARMA_BROWSER || 'PhantomJS'],
    },
  );

  return karmaConfig.set(config);
}
