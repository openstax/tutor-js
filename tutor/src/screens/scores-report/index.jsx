import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { computed, observable, action } from 'mobx';
import ContainerDimensions from 'react-container-dimensions';
import { isEmpty, get } from 'lodash';
import CoursePage from '../../components/course-page';
import ScoresTable from './table';
import TableFilters from './table-filters';
import NoPeriods from '../../components/no-periods';
import Courses from '../../models/courses-map';
import ScoresReportExportControls from './export-controls';
import ScoresReportNav from './nav';
import TourRegion from '../../components/tours/region';
import LoadingScreen from 'shared/components/loading-animation';
import './styles.scss';
import UX from './ux';

export default
@observer
class StudentScores extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      courseId: PropTypes.string.isRequired,
    }).isRequired,
  }

  @computed get course() {
    return Courses.get(this.props.params.courseId);
  }

  ux = new UX(this.course);

  @computed get title() {
    return (this.course.isTeacher && 'Student Scores') || 'Scores';
  }

  @observable sortIndex;
  @observable sort = { key: 'name', asc: true, dataType: 'score' };

  componentWillMount() {
    this.course.scores.fetch();
  }

  @action.bound changeSortingOrder(key, dataType) {
    this.sort.asc = this.sort.key === key ? (!this.sort.asc) : false;
    this.sort.key = key;
    this.sort.dataType = dataType;
  }

  @action.bound selectPeriod(period, key) {
    this.ux.periodIndex = key;
  }

  renderAfterTabsItem() {
    if (!get(this.ux.period, 'students.length')) { return null; }

    return (
      <span className="course-scores-note tab">
        Scores reflect work submitted on time.
        To accept late work, click the orange triangle.
      </span>
    );
  }

  renderControls() {
    return (
      <div className="controls">
        <TableFilters ux={this.ux} />
        <ScoresReportExportControls course={this.course}/>
      </div>
    );
  }

  render() {

    const courseId = this.course.id;

    if (!this.course.scores.api.hasBeenFetched) {
      return <LoadingScreen className="course-scores-report" message="Loading Scores…" />;
    }

    if (isEmpty(this.course.periods.active)) {
      return <NoPeriods courseId={courseId} />;
    }

    return (
      <CoursePage
        course={this.course}
        title={this.title}
        className="course-scores-report"
        controls={this.renderControls()}
        fullWidthChildren={
          <TourRegion
            id="scores"
            courseId={courseId}
            otherTours={['preview-scores']}
          >
            <ContainerDimensions>
              <ScoresTable
                ux={this.ux}
                sort={this.sort}
                onSort={this.changeSortingOrder}
                dataType={this.sort.dataType}
              />
            </ContainerDimensions>
          </TourRegion>
        }
      >
        <ScoresReportNav
          course={this.course}
          handleSelect={this.selectPeriod}
          afterTabsItem={this.renderAfterTabsItem()}
        />
      </CoursePage>
    );
  }
};
