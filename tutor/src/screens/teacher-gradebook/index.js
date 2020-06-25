import { React, PropTypes, observer } from 'vendor';
import CoursePage from '../../components/course-page';
import Controls from './controls';
import ScoresReportNav from './nav';
import TourRegion from '../../components/tours/region';
import LoadingScreen from 'shared/components/loading-animation';
import CourseBreadcrumb from '../../components/course-breadcrumb';
import Table from './table';
import { BackgroundWrapper } from '../../helpers/background-wrapper';

import './styles.scss';
import UX from './ux';

const titleBreadcrumbs = (course) => {
  return <CourseBreadcrumb course={course} currentTitle="Gradebook" noBottomMargin />;
};

const titleControls = (ux) => {
  return <ScoresReportNav ux={ux} />;
};

@observer
class TeacherGradeBook extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      courseId: PropTypes.string.isRequired,
    }).isRequired,
    ux: PropTypes.instanceOf(UX),
  };
  
  ux = new UX(this.props.params)

  componentDidUpdate() {
    this.ux.updateProps(this.props);
  }

  render() {
    const { ux } = this;
    let body = null;

    if (!ux.isReady) {
      return <LoadingScreen message="Loading Gradebook…" />;
    }

    if (!ux.course.periods.active.length) {
      body = <NoPeriods courseId={ux.course.id} />;
    }
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
          <Controls ux={ux} />
          <TourRegion
            id="gradebook"
            className="gradebook-table"
            courseId={ux.course.id}
            otherTours={['preview-gradebook']}
          >
            {body || <Table ux={ux} />}
          </TourRegion>
        </CoursePage>
      </BackgroundWrapper>
    );
  }

}


export default TeacherGradeBook;
