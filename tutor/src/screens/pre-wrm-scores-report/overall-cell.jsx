import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Cell } from 'fixed-data-table-2';
import UX from './ux';
import { observer } from 'mobx-react';

const OverallCell = observer(({ ux, rowIndex }) => {
    const student = ux.students[rowIndex];
    const studentAverages = ux.studentsAverages[student.role];

    return (
        <Cell className={cn('overall-cell', {
            'is-dropped': student.is_dropped,
            'is-expanded': ux.isAveragesExpanded,
        })}>
            <div className="course">
                {studentAverages.course_average}
            </div>
            <div className="homework">
                <div className="score">{studentAverages.homework_score}</div>
                <div className="completed">{studentAverages.homework_progress}</div>
            </div>
            <div className="reading">
                <div className="score">{studentAverages.reading_score}</div>
                <div className="completed">{studentAverages.reading_progress}</div>
            </div>
        </Cell>
    );
});
OverallCell.displayName = 'OverallCell';
OverallCell.propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
};

export default OverallCell;
