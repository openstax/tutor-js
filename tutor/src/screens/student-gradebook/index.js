import { React, PropTypes, observer } from 'vendor';
import Table from './table';
import TourRegion from '../../components/tours/region';
import CoursePage from '../../components/course-page';
import CourseBreadcrumb from '../../components/course-breadcrumb';
import LoadingScreen from 'shared/components/loading-animation';
import { BackgroundWrapper } from '../../helpers/background-wrapper';
import UX from './ux';

const titleBreadcrumbs = (course) => {
  /** 5/27/20: Display title as Scores */
  return <CourseBreadcrumb course={course} currentTitle="Scores" />;
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
          /** 5/27/20: Display title as Scores */
          title="Scores"
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
