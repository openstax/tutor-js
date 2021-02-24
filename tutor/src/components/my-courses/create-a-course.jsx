import React from 'react';
import TutorLink from '../link';
import IconAdd from '../icons/add';
import TourAnchor from '../tours/anchor';


const CreateACourse = () => {
    return (
        <TourAnchor id="create-course-zone">
            <div className="my-courses-add-zone">
                <TutorLink to="createNewCourse">
                    <div>
                        <IconAdd />
                        <span>CREATE A COURSE</span>
                    </div>
                </TutorLink>
            </div>
        </TourAnchor>
    );
}

export default CreateACourse
