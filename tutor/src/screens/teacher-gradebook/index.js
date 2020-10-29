import { React, PropTypes, observer, styled } from 'vendor';
import CoursePage from '../../components/course-page';
import NoPeriods from '../../components/no-periods';
import CourseBreadcrumb from '../../components/course-breadcrumb';
import TourRegion from '../../components/tours/region';
import NoStudentsMessage from '../../components/no-students-message';
import { BackgroundWrapper } from '../../helpers/background-wrapper';
import Router from '../../helpers/router';
import LoadingScreen from 'shared/components/loading-animation';
import Controls from './controls';
import ScoresReportNav from './nav';
import Table from './table';
import UX from './ux';
import './styles.scss';

const titleBreadcrumbs = (course) => {
  return <CourseBreadcrumb course={course} currentTitle="Gradebook" noBottomMargin />;
};

const titleControls = (ux) => {
  return <ScoresReportNav ux={ux} />;
};

const StyledTourRegion = styled(TourRegion)`
  display: flex;
  flex-flow: column;
`;

@observer
class TeacherGradeBook extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      courseId: PropTypes.string.isRequired,
    }).isRequired,
    ux: PropTypes.instanceOf(UX),
  };
  
  ux = new UX({ ...this.props.params, ...Router.currentQuery() })

  componentDidUpdate() {
    this.ux.updateProps(this.props);
  }

  renderTableData(ux) {
    if (!ux.isReady) {
      return <LoadingScreen message="Loading Gradebook…" />;
    }

    if (!ux.hasAnyStudents) {
      return <NoStudentsMessage courseId={ux.course.id} />;
    }

    let body = null;

    if (!ux.course.periods.active.length) {
      body = <NoPeriods courseId={ux.course.id} />;
    }

    return (
      <>
        <Controls ux={ux} />
        <StyledTourRegion
          id="gradebook"
          className="gradebook-table"
          courseId={ux.course.id}
          otherTours={['preview-gradebook']}
        >
          {body || <Table ux={ux} />}
        </StyledTourRegion>
      </>
    );
  }

  render() {
    const { ux } = this;
    return (
      <BackgroundWrapper>
        <CoursePage
          course={ux.course}
          title=""
          className="course-scores-report"
          titleBreadcrumbs={titleBreadcrumbs(ux.course)}
          titleAppearance="light"
          controls={titleControls(ux)}
          controlBackgroundColor='white'
        >
          {this.renderTableData(ux)}
        </CoursePage>
      </BackgroundWrapper>
    );
  }
}

export default TeacherGradeBook;
