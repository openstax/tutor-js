import PropTypes from 'prop-types';
import React from 'react';
import Export from './export';
import LmsPush from './lms-push';
import Course from '../../models/course';

const ScoresReportExportControls = ({ course }) => {
    if (!course.currentRole.isTeacher) {
        return null;
    }

    return (
        <div className="export-controls">
            <LmsPush course={course} />
            <Export course={course} />
        </div>
    );
};


ScoresReportExportControls.propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
};

export default ScoresReportExportControls;
