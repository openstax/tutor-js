import { observable, computed, action } from 'mobx';
import studentDataSorter from './student-data-sorter';
import WindowSize from '../../models/window-size';
import WeightsUX from './weights-ux';
import UiSettings from 'shared/model/ui-settings';
import Courses from '../../models/courses-map';
import {
  find, first, pick, pickBy, mapValues,
  groupBy, flow, map, partial, uniq, keys, isEmpty, isNil,
  filter, sortBy, maxBy, minBy, orderBy,
} from 'lodash';
import S, { UNWORKED } from '../../helpers/string';

const scoreKeyToType = (key) => (key.match(/(course_average|homework|reading)/)[0]);

export default class GradeBookUX {

  windowSize = new WindowSize();

  @observable isNameInverted = true;
  @observable showAverageInfoModal = false;
  @observable isReady = false;
  @observable currentPeriodScores;
  @observable props = {}
  @observable periodId;

  @observable sortIndex;
  @observable rowSort = { key: this.isNameInverted ? 'last_name' : 'first_name', asc: true, dataType: 'score' };
  @observable weights = new WeightsUX(this);

  @observable searchingMatcher = null;

  @UiSettings.decorate('gb.sap') displayScoresAsPercent = false;
  @UiSettings.decorate('gp.cbt') arrangeColumnsByType = false;
  @UiSettings.decorate('gp.cbp') arrangeColumnsByPoints = false;
  @UiSettings.decorate('gp.sds') showDroppedStudents = false;

  constructor(props) {
    this.initialize(props);
    this.props = props;
  }

  async initialize({
    courseId,
    course = Courses.get(courseId),
  }) {
    this.course = course;
    await this.course.scores.fetch();
    this.periodId = first(this.course.periods.active).id;
    this.currentPeriodScores = find(this.course.scores.periods.array, s => s.period_id === this.periodId) || [];
    this.isReady = true;
  }

  @action.bound onSelectPeriod(period) {
    this.periodId = period.id;
    this.currentPeriodScores = find(this.course.scores.periods.array, s => s.period_id === this.periodId) || [];
  }

  @computed get pageTitle() {
    return this.isTeacher ? 'Student Scores' : 'Scores';
  }

  @action.bound onSearchStudentChange({ target: { value } }) {
    this.searchingMatcher = value ? RegExp(value, 'i') : null;
  }

  @computed get isTeacher() {
    return this.course.currentRole.isTeacher;
  }

  @computed get scores() {
    return this.course.scores;
  }

  @action.bound changeRowSortingOrder(key, dataType) {
    this.rowSort.asc = this.rowSort.key === key ? (!this.rowSort.asc) : false;
    this.rowSort.key = key;
    this.rowSort.dataType = dataType;
  }

  sortForColumn(sortKey, dataType) {
    return (this.rowSort.key === sortKey) && (this.rowSort.dataType === dataType) ? this.rowSort : false;
  }

  isRowSortedBy({ sortKey, dataType }) {
    return (this.rowSort.key === sortKey) && (this.rowSort.dataType === dataType);
  }

  @computed get studentRowSorter() {
    return studentDataSorter.rows({ sort: this.rowSort, displayAs: this.displayAs });
  }

  @computed get columnSorter() {
    const sorter = studentDataSorter.columns;
    if (this.arrangeColumnsByType) {
      if (this.arrangeColumnsByPoints) {
        return sorter.type_and_points;
      }
      return sorter.type;
    } else if (this.arrangeColumnsByPoints) {
      return sorter.published_points;
    }
    return sorter.date;
  }

  @computed get headings() {
    return orderBy(this.currentPeriodScores.data_headings, this.columnSorter.headings, 'desc');
  }

  studentTasks(student) {
    return orderBy(student.data, this.columnSorter.tasks, 'desc');
  }


  @computed get period() {
    return this.scores.periods.get(this.coursePeriod.id);
  }

  @computed get students() {
    if(!this.currentPeriodScores) return [];
    
    const students = sortBy(
      filter(this.currentPeriodScores.students, s => !s.is_dropped),
      this.studentRowSorter,
    );
    if (!this.rowSort.asc) {
      students.reverse();
    }
    if (this.showDroppedStudents) {
      students.push(...this.droppedStudents);
    }
    if (!this.searchingMatcher) {
      return students;
    }
    return filter(students, s => s.name.match(this.searchingMatcher));
  }

  @computed get droppedStudents() {
    return sortBy(
      filter(this.currentPeriodScores.students, 'is_dropped'),
      this.studentRowSorter,
    );
  }

  @computed get hasDroppedStudents() {
    return Boolean(find(this.currentPeriodScores.students, 'is_dropped'));
  }

  @action updateProps(props) {
    this.props = props;
  }

  /**
   * Show Average Info modal
   */
  @action.bound showAverageInfo() {
    this.showAverageInfoModal = true;
  }

  /**
   * Hide Average Info modal
   */
  @action.bound hideAverageInfo() {
    this.showAverageInfoModal = false;
  }

  displayStudentName(student) {
    if(this.isNameInverted) return `${student.last_name}, ${student.first_name}`;
    return `${student.first_name}, ${student.last_name}`;
  } 

  @computed get periodTasksByType() {
    return groupBy(this.currentPeriodScores.data_headings, 'type');
  }

  isAverageUnavailableByTypeForPeriod(type) {
    return isEmpty(this.periodTasksByType[type]);
  }

  nullAverageByType() {
    return UNWORKED;
  }

  // what task types is course score being weighed on?
  // e.g. ['homework'] or ['homework', 'reading']
  @computed get weightTypes() {
    return flow(
      partial(pick, partial.placeholder, this.weights.WEIGHT_KEYS),
      partial(pickBy, partial.placeholder, (weight) => weight > 0),
      keys,
      partial(map, partial.placeholder, scoreKeyToType),
      uniq,
    )(this.course);
  }

  @computed get nullAverageForCourse() {
    return UNWORKED;
  }

  maskAverages(averages) {
    return mapValues(averages, (average, key) => {
      const type = scoreKeyToType(key);
      let nullValue;

      if (isNil(average)){
        if (type === 'course_average') {
          nullValue = this.nullAverageForCourse;
        } else {
          nullValue = this.nullAverageByType();
        }
      }

      return nullValue || `${S.asPercent(average)}%`;
    });
  }

  @computed get periodAverages() {
    const scoreKeys = [
      'overall_course_average',
      'overall_homework_score',
      'overall_reading_score',
    ];

    const averages = pick(this.currentPeriodScores, scoreKeys);
    return this.maskAverages(averages);
  }

  maxScore(type) {
    const score = maxBy(this.students, type);
    if(!score) return UNWORKED;
    return `${S.asPercent(score[type])}%`;
  }

  minScore(type) {
    const score = minBy(this.students, type);
    if(!score) return UNWORKED;
    return `${S.asPercent(score[type])}%`;
  }
}
