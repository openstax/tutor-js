import React from 'react';
import classnames from 'classnames';

import OXLink from '../../factories/link';

const CloseButton = props => ({
  render() {
    const classNames = classnames('openstax-close-x', 'close', props.className);
    return <button {...OXLink.filterProps(props)} className={classNames} />;
  },
})
;

export default CloseButton;
