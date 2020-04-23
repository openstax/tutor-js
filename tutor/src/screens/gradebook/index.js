import { React, PropTypes, useState, useObserver } from 'vendor';
import CoursePage from '../../components/course-page';
import Controls from './controls';
import ScoresReportNav from './nav';
import TourRegion from '../../components/tours/region';
import LoadingScreen from 'shared/components/loading-animation';
import CourseBreadcrumb from '../../components/course-breadcrumb';
import Table from './table';
import { whiteBackgroundWrapper } from '../../helpers/backgroundWrapper';

import './styles.scss';
import UX from './ux';

const WhiteBackgroundWrapper = whiteBackgroundWrapper();

const titleBreadcrumbs = (course) => {
  return <CourseBreadcrumb course={course} currentTitle="Gradebook" />;
};

const titleControls = (ux) => {
  return <ScoresReportNav ux={ux} />;
};

const GradeBook = ({ ux: propsUX, ...props }) => {

  const [ux] = useState(propsUX || new UX(props.params));

  return useObserver(() => {
    let body = null;

    ux.updateProps(props);

    if (!ux.isReady) {
      return <LoadingScreen message="Loading Gradebook…" />;
    }

    if (!ux.course.periods.active.length) {
      body = <NoPeriods courseId={ux.course.id} />;
    }
    return (
      <WhiteBackgroundWrapper>
        <CoursePage
          course={ux.course}
          title="Gradebook"
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
      </WhiteBackgroundWrapper>
      
    );
  });

};

GradeBook.propTypes = {
  params: PropTypes.shape({
    courseId: PropTypes.string.isRequired,
  }).isRequired,
  ux: PropTypes.instanceOf(UX),
};

export default GradeBook;
