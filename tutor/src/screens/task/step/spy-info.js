import { React, PropTypes, observer } from '../../../helpers/react';
import { SpyMode } from 'shared';
import { toList } from '../../../helpers/object';

const SpyInfo = observer(({ model }) => (
  <SpyMode.Content>
    {toList(model.spy)}
  </SpyMode.Content>
));
SpyInfo.displayName = 'SpyInfo';
SpyInfo.propTypes = {
  model: PropTypes.shape({
    spy: PropTypes.object.isRequired,
  }).isRequired,
};

export { SpyInfo };
