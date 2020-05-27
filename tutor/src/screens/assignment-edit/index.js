import { React, PropTypes, observer, styled } from 'vendor';
import { ScrollToTop } from 'shared';
import TourRegion from '../../components/tours/region';
import Courses from '../../models/courses-map';
import Router from '../../helpers/router';
import LoadingScreen from 'shared/components/loading-animation';
import { Formik } from 'formik';
import { withRouter } from 'react-router';
import UX from './ux';
import { BackgroundWrapper } from '../../helpers/background-wrapper';
import CourseBreadcrumb from '../../components/course-breadcrumb';

import './styles.scss';

const StyledBackgroundWrapper = styled(BackgroundWrapper)`
  > * {
    max-width: 1200px;
    margin: 0 auto;
  }
`;

@withRouter
@observer
class AssignmentBuilder extends React.Component {

  static displayName = 'AssignmentBuilder';

  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
      courseId: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      step: PropTypes.string,
    }),
    history: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    // eslint-disable-next-line
    let { id, courseId, type } = props.params;

    // eslint-disable-next-line
    const course = props.course || Courses.get(courseId);

    this.ux = new UX();

    this.ux.initialize({
      ...Router.currentQuery(),
      ...props.params,
      history: props.history,
      course,
      onComplete: this.onComplete,
    });
  }

  componentDidUpdate() {
    if (this.props.params.step) {
      this.ux.steps.setIndex(this.props.params.step);
    }
  }

  render() {
    const { ux } = this;
    if (ux.isInitializing) {
      return <LoadingScreen message="Loading Assignment…" />;
    }

    return (
      <StyledBackgroundWrapper>
        <ScrollToTop>
          <TourRegion
            className="assignment-builder"
            id={`${ux.plan.type}-assignment-editor`}
            otherTours={[`${ux.plan.type}-assignment-editor-super`]}
            courseId={ux.course.id}
          >
            <CourseBreadcrumb course={this.ux.course} currentTitle={`Add ${ux.plan.type}`} />
            <Formik
              initialValues={ux.formValues}
              validateOnMount={true}
            >
              {ux.renderStep}
            </Formik>
          </TourRegion>
        </ScrollToTop>
      </StyledBackgroundWrapper>
    );
  }
}

export default AssignmentBuilder;
