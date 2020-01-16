import { React, PropTypes, observer } from 'vendor';
import { ScrollToTop } from 'shared';
import TourRegion from '../../components/tours/region';
import Courses from '../../models/courses-map';
import Router from '../../helpers/router';
import LoadingScreen from 'shared/components/loading-animation';
import { withRouter } from 'react-router';
import UX from './ux';

import './styles.scss';


@withRouter
@observer
class AssignmentBuilder extends React.Component {

  static displayName = 'AssignmentBuilder';

  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
      courseId: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
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
      course,
      onComplete: this.onComplete,
    });

  }

  render() {
    const { ux: { isInitializing, StepComponent, plan, course } } = this;

    if (isInitializing) {
      return <LoadingScreen message="Loading Assignment…" />;
    }

    return (
      <ScrollToTop>
        <TourRegion
          className="assignment-builder"
          id={`${plan.type}-assignment-editor`}
          otherTours={[`${plan.type}-assignment-editor-super`]}
          courseId={course.id}
        >
          <StepComponent ux={this.ux} />
        </TourRegion>
      </ScrollToTop>
    );
  }
}

export default AssignmentBuilder;
