import React from 'react';
import { Panel } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { computed, observable, action } from 'mobx';
import ContainerDimensions from 'react-container-dimensions'
import { merge, isEmpty, first, sortBy, extend } from 'lodash';
import Router from '../../helpers/router';
import ScoresTable from './table';
import TableFilters from './table-filters';
import NoPeriods from '../no-periods';

import Courses from '../../models/courses-map';

//import { ScoresStore, ScoresActions } from '../../flux/scores';
// import LoadableItem from '../loadable-item';
import ScoresExport from './export';
import CoursePeriodsNav from '../course-periods-nav';
import TourRegion from '../tours/region';
import WindowResizeListener from '../decorators/window-resize';
import StudentDataSorter from './student-data-sorter';
import OXFancyLoader from '../ox-fancy-loader';

const Loading = () => (
  <div className="scores"><OXFancyLoader isLoading={true} /></div>
);

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
    return this.course.activePeriods[this.periodIndex];
  }

  //  @observable period = first(this.course.activePeriods);
  @observable sortIndex;
  @observable periodIndex = 0;
  @observable sort = { key: 'name', asc: true, dataType: 'score' };
  @observable displayAs = 'percentage';

  componentWillMount() {
    this.course.roster.fetch();
    this.course.scores.fetch();
  }

  @action.bound changeSortingOrder(key, dataType) {
    this.sort.asc = this.sort.key === key ? (!this.sort.asc) : false;
    this.sort.key = key;
  }

  @action.bound selectPeriod(period, key) {
    this.periodIndex = key;
    //    this.updateStudentData({ period_id: period.id, periodIndex: key });
  }

  @action.bound changeDisplayAs(mode) {
    this.displayAs = mode;
  }

  @computed get data() {
    return this.course.scores.forPeriod(this.period);
  }

  // this.overall_average_score: scores.overall_average_score || 0,
  // }
  // overall_average_score

  // //    const scores = ScoresStore.getEnrolledScoresForPeriod(this.props.courseId, state.period_id);
  // if (scores != null) {
  //   this.setState(extend(state, {

  //     headings: scores.data_headings,
  //     rows: state.sort.asc ? rows : rows.reverse(),
  //   }));
  // } else {
  //   this.setState(extend(state, {overall_average_score: 0, headings: [], rows: [] }));
  // }
  // }

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
    const { course: { scores, roster } } = this;
    return Boolean(
      (0 === scores.periods.size && scores.hasApiRequestPending) ||
      (0 === roster.students.length && roster.hasApiRequestPending)
    );
  }

  render() {
    const courseId = this.course.id;
    // const { period_id } = this.state;

    if (this.isLoading) {
      return <Loading />;
    }

    if (isEmpty(this.course.activePeriods)) {
      return (
        <NoPeriods courseId={courseId} />
      );
    }

    return (
      <div className="course-scores-report" ref="scoresWrap">
        <span className="course-scores-title">
          Student Scores
        </span>
        {!isEmpty(this.data.rows) ? <ScoresExport courseId={courseId} /> : undefined}
        <div className="course-nav-container">
          <CoursePeriodsNav
            handleSelect={this.selectPeriod}
            courseId={courseId}
            afterTabsItem={this.renderAfterTabsItem()} />
          <TableFilters displayAs={this.displayAs} changeDisplayAs={this.changeDisplayAs} />
        </div>
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
      </div>
    );
  }
}

//
// export const ScoresShell = React.createClass({
//
//   render() {
//     const { courseId } = Router.currentParams();
//     const course = CourseStore.get(courseId);
//     return (
//       <Panel className="scores-report">
//         <LoadableItem
//           id={courseId}
//           store={ScoresStore}
//           actions={ScoresActions}
//           renderItem={
//             () => <Scores courseId={courseId} isConceptCoach={course.is_concept_coach}/>
//           }
//         />
//       </Panel>
//     );
//   }
// });
