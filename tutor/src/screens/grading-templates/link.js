import { React, PropTypes } from 'vendor';
import Course from '../../models/course';
import TutorLink from '../../components/link';

const GradingTemplateLink = ({ course }) => {

    return (
        <TutorLink
            to="gradingTemplates"
            data-test-id="grading-template-link"
            variant="link"
            params={{ courseId: course.id }}
        >
      Grading Templates
        </TutorLink>
    );
};

GradingTemplateLink.displayName = 'GradingTemplateLink';

GradingTemplateLink.propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
};

export default GradingTemplateLink;
