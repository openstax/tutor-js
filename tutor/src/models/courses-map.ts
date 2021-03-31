import Map, { hydrateModel } from 'shared/model/map';
import { ID, modelize, computed, action } from 'shared/model'
import Course from './course';
import { isEmpty, find } from 'lodash';
import { CourseObj } from './types'
import Api from '../api'

export { Course };

export class CoursesMap extends Map<ID, Course> {
    constructor(data: Array<object> | object = {}, options = {}) {
        super(data, options);
        modelize(this);
    }

    // override array in Map to return a sorted list with latest join date first
    @computed get array() {
          return this.values().sort((a, b) =>
              a.sortKey > b.sortKey ? -1 : a.sortKey < b.sortKey ? 1 : 0
          );
      }

    where(condition: (val: Course) => boolean): CoursesMap {
        return super.where(condition) as any as CoursesMap
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

    bootstrap( courseData: CourseObj[], options: { clear?: boolean } = {} ) {
        if (options.clear) { this.clear(); }
        courseData.forEach(cd => this.set(String(cd.id), hydrateModel(Course, cd, this)));
        return this;
    }

    async fetch(..._args: any[]): Promise<any> {
        this.onLoaded(
            await this.api.request<CourseObj[]>(Api.fetchCourses())
        )
    }

    @action onLoaded(courses: CourseObj[]) {
        courses.forEach((cd) => {
            const course = this.get(cd.id);
            course ? course.update(cd) : this.set(cd.id, hydrateModel(Course, cd, this));
        });
    }
}

const coursesMap = new CoursesMap();

export default coursesMap;
