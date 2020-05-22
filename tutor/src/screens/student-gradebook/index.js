import { React, PropTypes, observer } from 'vendor';
import Table from './table';
import TourRegion from '../../components/tours/region';
import CoursePage from '../../components/course-page';
import CourseBreadcrumb from '../../components/course-breadcrumb';
import LoadingScreen from 'shared/components/loading-animation';
import { BackgroundWrapper } from '../../helpers/background-wrapper';
import UX from './ux';

const titleBreadcrumbs = (course) => {
  return <CourseBreadcrumb course={course} currentTitle="Gradebook" />;
};

@observer
class StudentGradebook extends React.Component {

  static displayName = 'StudentGradebook';

  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
      courseId: PropTypes.string.isRequired,
    }),
  }

  ux = new UX({
    ...this.props.params,
  });

  render() {
    const { ux } = this;

    if (!ux.isReady) {
      return <LoadingScreen message="Loading Grades…" />;
    }

    return (
      <BackgroundWrapper>
        <CoursePage
          course={ux.course}
          title="Gradebook"
          className="course-scores-report"
          titleBreadcrumbs={titleBreadcrumbs(ux.course)}
          titleAppearance="light"
          controlBackgroundColor='white'
        >
          <TourRegion
            id="gradebook"
            className="gradebook-table"
            courseId={this.ux.course.id}
            otherTours={['preview-gradebook']}
          >
            <Table ux={ux} />
          </TourRegion>
        </CoursePage>
      </BackgroundWrapper>
    );
  }
}

export default StudentGradebook;
