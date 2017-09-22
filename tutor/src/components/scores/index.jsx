import React from 'react';
import { observer } from 'mobx-react';
import { computed, observable, action } from 'mobx';
import ContainerDimensions from 'react-container-dimensions';
import { isEmpty } from 'lodash';
import CoursePage from '../course-page';
import ScoresTable from './table';
import TableFilters from './table-filters';
import NoPeriods from '../no-periods';
import Courses from '../../models/courses-map';
import ScoresExport from './export';
import CoursePeriodsNav from '../course-periods-nav';
import TourRegion from '../tours/region';
import LoadingScreen from '../loading-screen';


@observer
export default class StudentScores extends React.PureComponent {

  static propTypes = {
    params: React.PropTypes.shape({
      courseId: React.PropTypes.string.isRequired,
    }).isRequired,
  }

  @computed get course() {
    return Courses.get(this.props.params.courseId);
  }

  @computed get period() {
    return this.course.scores.periods.get(
      this.course.activePeriods[this.periodIndex].id
    );
  }

  @observable sortIndex;
  @observable periodIndex = 0;
  @observable sort = { key: 'name', asc: true, dataType: 'score' };
  @observable displayAs = 'percentage';

  componentWillMount() {
    this.course.scores.fetch();
  }

  @action.bound changeSortingOrder(key, dataType) {
    this.sort.asc = this.sort.key === key ? (!this.sort.asc) : false;
    this.sort.key = key;
    this.sort.dataType = dataType;
  }

  @action.bound selectPeriod(period, key) {
    this.periodIndex = key;
  }

  @action.bound changeDisplayAs(mode) {
    this.displayAs = mode;
  }

  @computed get data() {
    return this.course.scores.periods.get(this.period.id);
  }

  renderAfterTabsItem() {
    if (this.course.is_concept_coach) {
      return (
        <span className="course-scores-note tab">
          Click on a student’s score to review their work.
          Click the icon to see their progress completing the assignment.
        </span>
      );
    }
    return (
      <span className="course-scores-note tab">
        Scores reflect work submitted on time.
        To accept late work, click the orange triangle.
      </span>
    );
  }

  @computed get isLoading() {
    const { course: { scores } } = this;
    return Boolean(0 === scores.periods.size && scores.hasApiRequestPending);
  }

  renderControls() {
    return (
      <div className="course-nav-container">
        <CoursePeriodsNav
          handleSelect={this.selectPeriod}
          courseId={this.course.id}
          afterTabsItem={this.renderAfterTabsItem()}
        />
        <TableFilters displayAs={this.displayAs} changeDisplayAs={this.changeDisplayAs} />
        {isEmpty(this.course.students) ? null : <ScoresExport courseId={courseId} />}
      </div>
    );
  }

  render() {
    const courseId = this.course.id;
    if (this.isLoading) {  return <LoadingScreen message="Loading Scores…" />; }
    if (isEmpty(this.course.activePeriods)) { return <NoPeriods courseId={courseId} />; }

    return (
      <CoursePage
        course={this.course}
        className="course-scores-report"
        title="Scores"
        controls={this.renderControls()}
      >
        <TourRegion id="scores" courseId={courseId} otherTours={['preview-scores']}>
          <ContainerDimensions>
            <ScoresTable
              period={this.period}
              sort={this.sort}
              onSort={this.changeSortingOrder}
              colSetWidth={this.colSetWidth}
              displayAs={this.displayAs}
              dataType={this.sort.dataType}
              isConceptCoach={this.course.is_concept_coach}
            />
          </ContainerDimensions>
        </TourRegion>
      </CoursePage>
    );
  }
}
