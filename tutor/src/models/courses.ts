import Map, { KeyType } from '../../../shared/src/model/map'
import { computed, action } from 'mobx';
import Course from './course/course';
import { isEmpty, find } from 'lodash';

export { Course };

export class CoursesMap extends Map<Course> {

    // override array in Map to return a sorted list with latest join date first
    @computed get array() {
        return this.values().sort((a, b) =>
            a.sortKey > b.sortKey ? -1 : a.sortKey < b.sortKey ? 1 : 0
        );
    }

    @computed get active() {
        return this.where(c => c.is_active);
    }

    @computed get costing() {
        return this.where(c => c.does_cost);
    }

    @computed get student() {
        return this.where(c => c.currentRole.isStudent);
    }

    @computed get withoutStudents() {
        return this.where(c => 0 === c.students.length);
    }

    @computed get teaching() {
        return this.where(c => c.currentRole.isTeacher);
    }

    @computed get completed() {
        return this.where(c => c.hasEnded);
    }

    @computed get future() {
        return this.where(c => !c.hasStarted);
    }

    @computed get currentAndFuture() {
        return this.where(c => !c.hasEnded);
    }

    @computed get tutor() {
        return this.where(c => !c.is_concept_coach);
    }

    @computed get conceptCoach() {
        return this.where(c => c.is_concept_coach);
    }

    @computed get nonPreview() {
        return this.where(c => !c.is_preview);
    }

    @computed get previouslyCreated() {
        return this.where(c => !c.just_created);
    }

    @computed get preview() {
        return this.where(c => c.is_preview);
    }

    @computed get isViewed() {
        return this.where(c => c.dashboardViewCount > 0);
    }

    @action addNew(courseData: any) {
        const course = new Course(courseData, this);
        course.just_created = true;
        this.set(course.id, course);
        return course;
    }

    forEcosystemId(ecosystem_id: KeyType) {
        return find(this.array, c => c.isActive && c.ecosystem_id == ecosystem_id) ||
            find(this.array, c => c.ecosystem_id == ecosystem_id);
    }

    isNameValid(name: string) {
        return Boolean(!isEmpty(name) && !find(this.array, { name }));
    }

    bootstrap(courseData: [any], options: { clear?: boolean } = {}) {
        if (options.clear) { this.clear(); }
        courseData.forEach(cd => this.set(String(cd.id), new Course(cd, this)));
        return this;
    }

    // called by API
    fetch() { }

    @action onLoaded({ data }: { data: [any] }) {
        data.forEach((cd) => {
            const course = this.get(cd.id);
            course ? course.update(cd) : this.set(cd.id, new Course(cd, this));
        });
    }

}

const coursesMap = new CoursesMap();

export default coursesMap;
