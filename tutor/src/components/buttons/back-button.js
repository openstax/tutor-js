import { React, PropTypes, cn } from 'vendor';
import Router from '../../helpers/router';
import TutorLink from '../link';

import { TransitionStore } from '../../flux/transition';

const BackButton = ({ fallbackLink, className }) => {
  // Gets route to last path that was not the same as the current one
  // See TransitionStore for more detail.
  const historyInfo = TransitionStore.getPrevious();

  className = cn('btn', 'btn-default', className);

  const backText = (historyInfo != null ? historyInfo.name : undefined) ? `Back to ${historyInfo.name}` : (fallbackLink.text || 'Back');

  const to =  (historyInfo != null ? historyInfo.path : undefined) || Router.makePathname(
    fallbackLink.to, fallbackLink.params
  );

  return (
    <TutorLink className={className} to={to}>
      {backText}
    </TutorLink>
  );
};


BackButton.propTypes = {
  className: PropTypes.string,
  fallbackLink: PropTypes.shape({
    to: PropTypes.string,
    params: PropTypes.object,
    text: PropTypes.string,
  }).isRequired,
};


export default BackButton;
