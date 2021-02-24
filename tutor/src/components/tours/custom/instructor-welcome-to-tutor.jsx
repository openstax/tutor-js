import React from 'react';
import CourseUX from '../../../models/course/ux';

import {
    WelcomeToTutorMessage,
} from './common';


function InstructorWelcomeToTutor(props) {
    let cost = null;
    if (CourseUX.displayCourseCost) {
        cost = ` — for only ${CourseUX.formattedStudentCost}`;
    }
    return (
        <WelcomeToTutorMessage {...props} className="has-forest-background">
            <h2 className="sub-heading">
        Improve how your students learn with research-based
        technology{cost}.
            </h2>
        </WelcomeToTutorMessage>
    );
}

export default InstructorWelcomeToTutor;
