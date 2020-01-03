import { React, PropTypes, styled, observer } from 'vendor';
import { Button } from 'react-bootstrap';
import { withRouter } from 'react-router';
import Course from '../../models/course';

const Link = styled(Button)`


`;

const GradingTemplateLink = ({ course, history }) => {
  const href = `/course/${course.id}/grading-templates`;

  return (
    <Link
      href={href}
      data-test-id="grading-template-link"
      variant="link"
      onClick={() => history.push(href)}
    >
      Grading Templates
    </Link>
  );
};

GradingTemplateLink.displayName = 'GradingTemplateLink';

GradingTemplateLink.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  course: PropTypes.instanceOf(Course).isRequired,
};

export default withRouter(observer(GradingTemplateLink));
