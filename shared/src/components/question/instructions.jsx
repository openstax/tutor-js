import PropTypes from 'prop-types';
import React from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { observer } from 'mobx-react';

const Instructions = observer((props) => {
    const { can_be_updated, hasFeedback, hasIncorrectAnswer } = props;

    if (!can_be_updated) { return null; }

    if (hasIncorrectAnswer && hasFeedback) {
        return (
            <p className="instructions">
        Incorrect. Please review your feedback.
            </p>
        );
    }

    const popover = (
        <Popover ref="popover" id="instructions-help" className="openstax instructions">
            <p>
                <strong>
          Why do you ask me to answer twice?
                </strong>
            </p>
            <p>
        Research shows that recalling the answer to a question from memory
        helps your learning last longer.  So, Tutor asks
        for your own answer first, then gives multiple-choice options
        so you can get personalized feedback.
        Both you and your instructor can review your work later.
            </p>
        </Popover>
    );

    return (
        <p className="instructions">
      Now choose from one of the following options
            <OverlayTrigger placement="right" overlay={popover}>
                <span className="text-info">Why?</span>
            </OverlayTrigger>
        </p>
    );
});

Instructions.propTypes = {
    hasIncorrectAnswer: PropTypes.bool,
    hasFeedback: PropTypes.bool,
};

export default Instructions;
