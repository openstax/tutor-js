import { React, PropTypes, useState, useObserver } from 'vendor';
import { ScrollToTop } from 'shared';
import CoursePage from '../../components/course-page';
import Controls from './controls';
import ScoresReportNav from './nav';
import TourRegion from '../../components/tours/region';
import LoadingScreen from 'shared/components/loading-animation';
import Table from './table';

import './styles.scss';
import UX from './ux';

const GradeBook = ({ ux: propsUX, ...props }) => {

  const [ux ] = useState(propsUX || new UX(props.params));

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
      <ScrollToTop>
        <CoursePage
          course={ux.course}
          title={ux.title}
          className="course-scores-report"
          controls={<Controls ux={ux} />}
          fullWidthChildren={
            <TourRegion
              id="gradebook"
              className="gradebook-table"
              courseId={ux.course.id}
              otherTours={['preview-gradebook']}
            >
              {body || <Table ux={ux} />}
            </TourRegion>
          }
        >
          <ScoresReportNav ux={ux} />
        </CoursePage>
      </ScrollToTop>
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
