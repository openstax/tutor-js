import { React, PropTypes, cn } from 'vendor';
import Router from '../../helpers/router';
import TutorLink from '../link';
import backInfo from '../../helpers/backInfo';


const BackButton = ({ fallbackLink, className }) => {
    className = cn('btn', 'btn-default', className);
    const back = backInfo();
    const backText = fallbackLink.text || back.text || 'Back';
    const to =  fallbackLink.to && fallbackLink.params
        ? Router.makePathname(fallbackLink.to, fallbackLink.params)
        : back.to;

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
