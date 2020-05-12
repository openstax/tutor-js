import { observable, computed, action } from 'mobx';
import studentDataSorter from './student-data-sorter';
//import bezierAnimation from '../../helpers/bezier';
import WindowSize from '../../models/window-size';
import WeightsUX from './weights-ux';
import UiSettings from 'shared/model/ui-settings';
import Courses from '../../models/courses-map';
import {
  first, clone, reverse, isNil, pick, mapValues, filter, sortBy, some, isEmpty,
} from 'lodash';
import S from '../../helpers/string';

const CELL_AVERAGES_CLOSED_SINGLE_WIDTH = 120;
const CELL_AVERAGES_SINGLE_WIDTH = 90;
const IS_AVERAGES_EXPANDED_KEY = 'is_scores_averages_expanded';
const CLOSED_TO_OPENED = [CELL_AVERAGES_CLOSED_SINGLE_WIDTH, CELL_AVERAGES_SINGLE_WIDTH * 5];
const MIN_TABLE_HEIGHT = 300;

const OPENED_TO_CLOSED = reverse(clone(CLOSED_TO_OPENED));
const ROW_HEIGHT = 50;
const TABLE_PADDING = 18;
const WINDOW_HEIGHT_PADDING = 260;

const NOT_AVAILABLE_AVERAGE = 'n/a';
const PENDING_AVERAGE = '---';

const scoreKeyToType = (key) => (key.match(/(course_average|homework|reading)/)[0]);

export default class GradeBookUX {

  COLUMN_WIDTH = 170;

  ROW_HEIGHT = ROW_HEIGHT;

  windowSize = new WindowSize();

  @observable sortIndex;
  @observable rowSort = { key: 'name', asc: true, dataType: 'score' };
  @observable weights = new WeightsUX(this);

  @observable searchingMatcher = null;


  @observable showAverageInfoModal = false;
  @observable isReady = false;
  @observable coursePeriod;
  @observable props = {}

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
    this.coursePeriod = first(this.course.periods.active);
    await this.course.scores.fetch();

    this.isReady = true;
  }

  @action.bound onSelectPeriod(period) {
    this.coursePeriod = period;
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
      return sorter.points;
    }
    return sorter.date;
  }

  @computed get period() {
    return this.scores.periods.get(this.coursePeriod.id);
  }

  @computed get students() {
    const students = sortBy(
      filter(this.period.students, s => !s.is_dropped),
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
      filter(this.period.students, 'is_dropped'),
      this.studentRowSorter,
    );
  }

  @computed get headings() {
    return sortBy(this.period.data_headings, this.columnSorter.headings);
  }

  studentTasks(student) {
    return sortBy(student.data, this.columnSorter.tasks);
  }

  @action updateProps(props) {
    this.props = props;
  }

  /**
   * Show Average Info modal
   */
  @action showAverageInfo() {
    this.showAverageInfoModal = true;
  }

  /**
   * Hide Average Info modal
   */
  @action hideAverageInfo() {
    this.showAverageInfoModal = false;
  }

  // old & unused methods

  // @action.bound changeSortingOrder(key, dataType) {
  //   this.sort.asc = this.sort.key === key ? (!this.sort.asc) : false;
  //   this.sort.key = key;
  //   this.sort.dataType = dataType;
  // }

  // isSortedBy({ sortKey, dataType }) {
  //   return (this.sort.key === sortKey) && (this.sort.dataType === dataType);
  // }

  // @computed get isAveragesExpanded() {
  //   const isAveragesExpanded = UiSettings.get(IS_AVERAGES_EXPANDED_KEY);
  //   if (isUndefined(isAveragesExpanded)) {
  //     return true;
  //   }
  //   return isAveragesExpanded;
  // }

  // @computed get fromTo() {
  //   if (this.isAveragesExpanded) {
  //     return OPENED_TO_CLOSED;
  //   } else {
  //     return CLOSED_TO_OPENED;
  //   }
  // }

  // @computed get period() {
  //   const role = this.course.currentRole;
  //   const periodId = role.period_id || this.course.periods.active[this.periodIndex].id;
  //   return this.course.scores.periods.get(periodId);
  // }

  // @computed get periodTasksByType() {
  //   return groupBy(this.period.data_headings, 'type');
  // }

  // @computed get allTasksByType() {
  //   return groupBy(
  //     flatMap(this.course.scores.periods.values(), p => p.data_headings),
  //     'type'
  //   );
  // }

  // @action.bound onChangeDisplayValuesAs(mode) {
  //   this.displayValuesAs = mode;
  // }

  // isAverageUnavailableByType(type) {
  //   return isEmpty(this.allTasksByType[type]);
  // }

  isAverageUnavailableByTypeForPeriod(type) {
    return isEmpty(this.periodTasksByType[type]);
  }

  nullAverageByType(type) {
    if (this.isAverageUnavailableByTypeForPeriod(type)) {
      return NOT_AVAILABLE_AVERAGE;
    }
    return PENDING_AVERAGE;
  }

  // // are the weight types that are set affecting assignments of those types
  // @computed get areWeightsInUse() {
  //   return !find(this.weightTypes, type => this.isAverageUnavailableByType(type));
  // }

  // // what task types is course score being weighed on?
  // // e.g. ['homework'] or ['homework', 'reading']
  // @computed get weightTypes() {
  //   return flow(
  //     partial(pick, partial.placeholder, this.weights.WEIGHT_KEYS),
  //     partial(pickBy, partial.placeholder, (weight) => weight > 0),
  //     keys,
  //     partial(map, partial.placeholder, scoreKeyToType),
  //     uniq,
  //   )(this.course);
  // }

  @computed get nullAverageForCourse() {
    if (some(this.weightTypes, this.isAverageUnavailableByTypeForPeriod.bind(this))) {
      return NOT_AVAILABLE_AVERAGE;
    }
    return PENDING_AVERAGE;
  }

  maskAverages(averages) {
    return mapValues(averages, (average, key) => {
      const type = scoreKeyToType(key);
      let nullValue;

      if (isNil(average)){
        if (type === 'course_average') {
          nullValue = this.nullAverageForCourse;
        } else {
          nullValue = this.nullAverageByType(type);
        }
      }

      return nullValue || `${S.asPercent(average)}%`;
    });
  }

  // @computed get droppedStudents() {
  //   return sortBy(
  //     filter(this.period.students, 'is_dropped'),
  //     this.studentSorter,
  //   );
  // }

  // @computed get hasDroppedStudents() {
  //   return Boolean(find(this.period.students, 'is_dropped'));
  // }

  // @computed get students() {
  //   const students = sortBy(
  //     filter(this.period.students, s => !s.is_dropped),
  //     this.studentSorter,
  //   );
  //   if (!this.sort.asc) {
  //     students.reverse();
  //   }
  //   students.push(...this.droppedStudents);
  //   return students;
  // }

  // @computed get studentsAverages() {
  //   const scoreKeys = [
  //     'course_average',
  //     'homework_score',
  //     'homework_progress',
  //     'reading_score',
  //     'reading_progress',
  //   ];
  //   const averages = {};
  //   this.students.forEach((student) => {
  //     averages[student.role] = this.maskAverages(
  //       pick(student, scoreKeys)
  //     );
  //   });
  //   return averages;
  // }

  @computed get periodAverages() {
    const scoreKeys = [
      'overall_course_average',
      'overall_homework_score',
      'overall_homework_progress',
      'overall_reading_score',
      'overall_reading_progress',
    ];

    const averages = pick(this.period, scoreKeys);
    return this.maskAverages(averages);
  }

  // @computed get data() {
  //   return this.course.scores.periods.get(this.period.period_id);
  // }

  // @action.bound toggleAverageExpansion() {
  //   let onComplete = () => {
  //     UiSettings.set(IS_AVERAGES_EXPANDED_KEY, !this.isAveragesExpanded);
  //   };

  //   bezierAnimation({
  //     range: this.fromTo,
  //     duration: 500, // ms
  //     onStep: (width) => { this.averagesWidth = width; },
  //     onComplete,
  //   });
  // }

  // @computed get isTeacher() {
  //   return this.course.currentRole.isTeacher;
  // }

  // @computed get headerHeight() {
  //   return (this.isTeacher && 180) || 140;
  // }

  // @computed get windowHeightPadding() {
  //   return (this.isTeacher && (WINDOW_HEIGHT_PADDING + 95)) || WINDOW_HEIGHT_PADDING;
  // }

  // @computed get tableWidth() {
  //   const extraCol = this.isTeacher ? 1 : 0;
  //   const desiredWidth = this.averagesWidth +
  //     (this.COLUMN_WIDTH * (this.period.numAssignments + extraCol));

  //   return Math.max(Math.min(
  //     desiredWidth, (this.windowSize.width - PADDING)
  //   ), ((this.COLUMN_WIDTH * 2) + this.averagesWidth));
  // }

  // @computed get desiredHeight() {
  //   return this.students.length * ROW_HEIGHT + this.headerHeight + TABLE_PADDING;
  // }

  // @computed get expectedHeight() {
  //   return this.windowSize.height - this.windowHeightPadding;
  // }

  // @computed get tableHeight() {
  //   return Math.max(Math.min(
  //     this.desiredHeight, this.expectedHeight
  //   ), MIN_TABLE_HEIGHT);
  // }

}
