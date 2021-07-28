import { observable, computed, action, modelize, runInAction } from 'shared/model'
import studentDataSorter from './student-data-sorter';
import { WindowSize, currentCourses } from '../../models';
import WeightsUX from './weights-ux';
import UiSettings from 'shared/model/ui-settings';
import {
    find, pick, pickBy, mapValues,
    groupBy, flow, map, partial, uniq, keys, isEmpty, isNil,
    filter, sortBy, maxBy, minBy, orderBy, some,
} from 'lodash';
import S from '../../helpers/string';
import ScoresHelper, { UNWORKED } from '../../helpers/scores';

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
    @observable weights;

    @observable searchingMatcher = null;

    get displayScoresAsPoints() { return UiSettings.get('gb.sap') || false }
    set displayScoresAsPoints(value) { UiSettings.set('gb.sap', value) }

    get arrangeColumnsByType() { return UiSettings.get('gp.cbt') || false }
    set arrangeColumnsByType(value) { UiSettings.set('gp.cbt', value) }

    get showDroppedStudents() { return UiSettings.get('gp.sds') || false }
    set showDroppedStudents(value) { UiSettings.set('gp.sds', value) }

    constructor(props) {
        modelize(this);
        this.initialize(props);
        this.props = props;
        this.weights = new WeightsUX(this);
    }

    async initialize({
        courseId,
        course = currentCourses.get(courseId), // eslint-disable-line
        tab = 0,
    }) {
        this.course = course;
        await this.course.scores.fetch();

        // set the periodId base on the tab in the current url query
        let activeTab = parseInt(tab, 10);
        const numberOfActivePeriods = this.course.periods.active.length;
        if(activeTab > numberOfActivePeriods - 1) {
            activeTab = numberOfActivePeriods - 1;
        }
        this.periodId = this.course.periods.active[activeTab].id;

        this.currentPeriodScores = this.course.scores.periods.get(this.periodId)
        runInAction(() => { this.isReady = true })
    }

    @action.bound onSelectPeriod(period) {
        this.periodId = period.id;
        this.currentPeriodScores = this.course.scores.periods.get(this.periodId);
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
            return sorter.type;
        }
        return sorter.default;
    }

    @computed get headings() {
        return orderBy(this.currentPeriodScores.data_headings, this.columnSorter.headings, 'desc');
    }

    studentTasks(student) {
        return orderBy(student.data, this.columnSorter.tasks, 'desc');
    }

    hasProvisionalScores(index) {
        return !!this.students.find(s => s.data[index].is_provisional_score);
    }

    @computed get period() {
        return this.scores.periods.get(this.coursePeriod.id);
    }

    @computed get allStudents() {
        return this.currentPeriodScores?.students || [];
    }

    @computed get students() {
        const students = sortBy(
            filter(this.allStudents, s => !s.is_dropped),
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
            filter(this.allStudents, 'is_dropped'),
            this.studentRowSorter,
        );
    }

    @computed get hasDroppedStudents() {
        return Boolean(find(this.allStudents, 'is_dropped'));
    }

    @computed get hasAnyStudents() {
        return some(this.allStudents, s => !s.is_dropped);
    }

    @computed get hasAnyAssignmentHeadings() {
        return this.headings && this.headings.length > 0;
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
        return `${student.first_name} ${student.last_name}`;
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
        return `${ScoresHelper.asPercent(score[type])}%`;
    }

    minScore(type) {
        const score = minBy(this.students, type);
        if(!score) return UNWORKED;
        return `${ScoresHelper.asPercent(score[type])}%`;
    }
}
