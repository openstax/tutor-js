import React from 'react';

const TutorRequired = () => (
    <div className="hint required-hint">
    Required field
    </div>
);


const TutorUrl = () => (
    <div className="hint">
    Please type in a url.
    </div>
);

const TutorPeriodNameExists = () => (
    <div className="hint">
    Name already exists.
    </div>
);

const TutorTimeIncorrectFormat = () => (
    <div className="hint">
    Please type a time.
    </div>
);

export {
    TutorRequired as required,
    TutorUrl as url,
    TutorPeriodNameExists as periodNameExists,
    TutorTimeIncorrectFormat as incorrectTime,
};
