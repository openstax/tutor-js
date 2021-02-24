import { React, PropTypes } from 'vendor';
import {
    ValueProp,
    ColumnContent,
    Column,
} from './common';
import CourseBranding from '../../branding/course';
import TutorLink from '../../link';


const HowToBuildYourReading = ({ ride, ...props }) => {

    const { courseId } = ride.tour;

    return (
        <ValueProp ride={ride} {...props} className="build-reading">
            <h1 className="heading">
        How to build a reading assignment
            </h1>
            <h2 className="sub-heading">
        You select the chapters and sections, we do the rest.
            </h2>
            <ColumnContent>
                <Column className="machine-learning">
                    <p>
            Select what you want your students to read, and <CourseBranding/> picks the questions for you
                    </p>
                </Column>
                <Column className="exclude-question">
                    <p>
            You can manage questions in the<br/>
                        <TutorLink to='viewQuestionsLibrary' params={{ courseId }}>
              Question Library
                        </TutorLink> before you publish your assignment
                    </p>
                </Column>
            </ColumnContent>
        </ValueProp>
    );
};

HowToBuildYourReading.propTypes = {
    ride: PropTypes.object.isRequired,
};

export default HowToBuildYourReading;
