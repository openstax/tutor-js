import PropTypes from 'prop-types';
import React from 'react';

import OXColoredStripe from 'shared/components/ox-colored-stripe';
import TutorLink from './link';
import { Icon } from 'shared';

const DEFAULT_MESSAGE = 'Kudos on your desire to explore! Unfortunately, ' +
                        'we don’t have a page to go with that particular location.';

export default function InvalidPage(props) {
    const {
        message = DEFAULT_MESSAGE,
    } = props;

    return (
        <div className="invalid-page">
            <OXColoredStripe />
            <h1>
        Uh-oh, no page here
            </h1>
            <p>{message}</p>
            <TutorLink className="home" to="myCourses" variant="primary">
        Return Home
                <Icon type="caret-right" />
            </TutorLink>
        </div>
    );
}

InvalidPage.propTypes = {
    message: PropTypes.string,
};
