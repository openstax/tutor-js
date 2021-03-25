import { observable, computed, action } from 'mobx';
import { orderBy } from 'lodash';
import Courses from '../../models/courses-map';
import Router from '../../helpers/router';

export default class StudentGradeBookUX {

    sortFieldConstants = {
        title: 'reportHeading.title',
        dueAt: 'due_at',
        points: 'published_points',
        score: 'published_score',
    }

    sortOrderConstants = {
        asc: 'asc',
        desc: 'desc',
    }

    @observable isReady = false;
    @observable sortField = this.sortFieldConstants.dueAt;
    @observable sortOrder = this.sortOrderConstants.desc;

    constructor(props) {
        modelize(this);
        this.initialize(props);
        this.props = props;
    }

    async initialize({
        courseId,
        course = Courses.get(courseId),
    }) {
        this.course = course;
        await this.course.scores.fetch();

        this.isReady = true;
    }

    @computed get role() {
        return this.course.currentRole;
    }

    @computed get scores() {
        return this.course.scores.periods.get(this.role.period_id);
    }

    @computed get student() {
        return this.scores.students.find(s => s.role == this.role.id);
    }

    @computed get studentData() {
        const studentData = this.student.data;
        return orderBy(studentData, [this.sortField], [this.sortOrder]);
    }

    @action.bound goToAssignment(history, courseId, taskId) {
        history.push(Router.makePathname('viewTask', { courseId: courseId, id: taskId }));
    }

    @action.bound sort(sortField) {
        this.sortField = sortField;
        this.sortOrder = this.sortOrder === this.sortOrderConstants.asc
            ? this.sortOrderConstants.desc
            : this.sortOrderConstants.asc;
    }

    @action.bound displaySort(sortField) {
        if (this.sortField === sortField) {
            return {
                asc: this.sortOrder === this.sortOrderConstants.asc,
            };
        }
        return null;
    }
}
