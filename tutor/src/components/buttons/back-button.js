import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import Router from '../../helpers/router';
import TutorLink from '../link';

import { TransitionActions, TransitionStore } from '../../flux/transition';

class BackButton extends React.Component {
  static displayName = 'BackButton';

  static propTypes = {
    className: PropTypes.string,
    fallbackLink: PropTypes.shape({
      to: PropTypes.string,
      params: PropTypes.object,
      text: PropTypes.string,
    }).isRequired,
  };

  render() {
    // Gets route to last path that was not the same as the current one
    // See TransitionStore for more detail.
    const historyInfo = TransitionStore.getPrevious();
    let { fallbackLink, className } = this.props;
    className = classnames('btn', 'btn-default', className);

    const backText = (historyInfo != null ? historyInfo.name : undefined) ? `Back to ${historyInfo.name}` : (fallbackLink.text || 'Back');

    const to =  (historyInfo != null ? historyInfo.path : undefined) || Router.makePathname(
      this.props.fallbackLink.to, this.props.fallbackLink.params
    );

    return (
      <TutorLink className={className} to={to}>
        {backText}
      </TutorLink>
    );
  }
}

export default BackButton;
