import Map, { hydrateModel } from 'shared/model/map';
import { ID, modelize, computed, action, override } from 'shared/model'
import { CourseData, Course } from '../models'
import type { Offering } from '../models'
import { isEmpty, find, maxBy } from 'lodash';
import urlFor from '../api'

export class CoursesMap extends Map<ID, Course> {
    static Model = Course

    constructor(data: Array<object> | object = {}, options = {}) {
        super(data, options);
        modelize(this);
    }

    // override array in Map to return a sorted list with latest join date first
    @override get array() {
        return this.values().sort((a, b) =>
            a.sortKey > b.sortKey ? -1 : a.sortKey < b.sortKey ? 1 : 0
        );
    }

    where(condition: (_course: Course) => boolean): CoursesMap {
        return super.where(condition)
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

    latestForOffering(offering: Offering) {
        return maxBy(this.forOffering(offering).array, 'ends_at')
    }

    forOffering(offering: Offering) {
        return this.where(c => c.offering_id == offering.id)
    }

    @action addNew(courseData: CourseData) {
        const course = hydrateModel(Course, courseData, this);
        course.just_created = true;
        this.set(course.id, course);
        return course;
    }

    forEcosystemId(ecosystem_id: ID) {
        return find(this.array, c => c.isActive && c.ecosystem_id == ecosystem_id ) ||
        find(this.array, c => c.ecosystem_id == ecosystem_id) ;
    }


    isNameValid(name: string) {
        return Boolean(!isEmpty(name) && !find(this.array, { name }));
    }

    @action bootstrap( courseData: CourseData[], options: { clear?: boolean } = {} ) {
        if (options.clear) { this.clear(); }
        courseData.forEach(cd => this.set(String(cd.id), hydrateModel(Course, cd, this)));
        return this;
    }

    async fetch(..._args: any[]): Promise<any> {
        this.onLoaded(
            await this.api.request<CourseData[]>(urlFor('fetchCourses'))
        )
    }

    @action onLoaded(courses: CourseData[]) {
        courses.forEach((cd) => {
            const course = this.get(cd.id);
            course ? course.update(cd) : this.set(cd.id, hydrateModel(Course, cd, this));
        });
    }

}

export const currentCourses = new CoursesMap();
