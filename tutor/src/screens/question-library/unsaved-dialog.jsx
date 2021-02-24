import React from 'react';
import TutorDialog from '../../components/tutor-dialog';

export default function(message) {
    const body =
    <div>
        <p className="lead">
            {message}
        </p>
    </div>;
    return (
        TutorDialog.show({
            body, title: 'You have excluded exercises that have not been saved',
        })
    );
}
