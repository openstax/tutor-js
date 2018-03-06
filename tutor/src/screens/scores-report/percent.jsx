import React from 'react';
import { isNil } from 'lodash';
import { observer } from 'mobx-react';
import { asPercent } from '../../helpers/string';

const Percent = observer(({ value, className, nilAsNA }) => {
  const nil = nilAsNA ? 'n/a' : '---';
  const display = isNil(value) ? nil : `${asPercent(value)}%`;
  return <div className={className}>{display}</div>;
});

Percent.propTypes = {
  value: React.PropTypes.any,
  className: React.PropTypes.string.isRequired,
};

export default Percent;
