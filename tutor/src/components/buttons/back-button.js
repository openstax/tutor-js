import { React, PropTypes, cn } from 'vendor';
import Router from '../../helpers/router';
import TutorLink from '../link';
import backInfo from '../../helpers/backInfo';


const BackButton = ({ fallbackLink, className }) => {
  className = cn('btn', 'btn-default', className);
  const back = backInfo();
  const backText = back.text || fallbackLink.text || 'Back';
  const to =  back.to || Router.makePathname(fallbackLink.to, fallbackLink.params);

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
