import React from 'react';
import {
    ValueProp,
    ColumnContent,
    Column,
} from './common';

const HowToUsePreview = (props) => {
    return (
        <ValueProp {...props} className="course-preview">
            <h1 className="heading">
        What can you do in a preview course?
            </h1>
            <h2 className="sub-heading">
        Test drive all the features, but your work won't transfer to a live course.
            </h2>
            <ColumnContent>
                <Column className="all-features">
                    <p>
            Try all the features
                    </p>
                </Column>
                <Column className="view-analytics">
                    <p>
            View analytics with student sample data
                    </p>
                </Column>
                <Column className="view-textbook-questions">
                    <p>
            Browse the textbook and questions
                    </p>
                </Column>
                <Column className="cant-save-work">
                    <p>
            Remember, work you do here won't be saved
                    </p>
                </Column>
            </ColumnContent>
        </ValueProp>
    );

};

export default HowToUsePreview;
