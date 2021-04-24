import { BaseModel, field, model, computed, observable, action, ID, NEW_ID, modelize } from 'shared/model';
import { readonly } from 'core-decorators';
import { extend, omit, inRange } from 'lodash';

import {
    currentCourses, currentOfferings, CourseTerm, CoursesMap, Course, Offering, OfferingsMap,
} from '../../models'

import urlFor from '../../api'
import type { CourseData } from '../types';

export class CourseCreate extends BaseModel {

    @field name = ''
    @field offering_id: ID = ''
    @field num_sections = 1
    @field estimated_student_count = 0
    @field is_preview = false
    @field timezone = 'US/Central'
    @observable new_or_copy = 'new'
    @observable cloned_from_id:ID = NEW_ID
    @field copy_question_library = true

    @observable createdCourse?: Course

    @model(CourseTerm) term?: CourseTerm
    @observable errors = observable.map()

    courses: CoursesMap
    offerings: OfferingsMap

    @readonly validations = {
        num_sections: {
            name: 'sections',
            range: [ 1, 10 ],
        },
        estimated_student_count: {
            name: 'students',
            range: [ 1, 1500 ],
        },
    }

    constructor(
        { courses = currentCourses, offerings = currentOfferings, ...attrs }: { offerings?: OfferingsMap, courses?: CoursesMap, offering_id?: ID } = {}
    ) {
        super(attrs)
        modelize(this)
        this.courses = courses
        this.offerings = offerings
    }

    @action setValue(attr: string, count: any) {
        const range = this.validations[attr].range
        if (range && inRange(count, range[0], range[1]+1)) {
            this[attr] = count
            this.errors.delete(attr)
        } else {
            this.errors.set(attr, {
                direction: count < range[0] ? 'less' : 'more',
                attribute: this.validations[attr].name,
                value: count < range[0] ? range[0] : range[1],
            })
        }
    }

    @computed get error() {
        return this.errors.size ? Array.from(this.errors.values())[0] : null
    }

    @computed get offering() {
        return this.offerings.get(this.offering_id)
    }

    set offering(offering: Offering | undefined) {
        if (!offering) return
        this.offering_id = offering.id
        this.name = offering.title
    }

    @computed get cloned_from() {
        return this.cloned_from_id ? this.courses.get(this.cloned_from_id) : undefined
    }

    set cloned_from(course: Course|undefined) {
        if (!course) return
        this.cloned_from_id = course.id
        if (this.canCloneCourse) {
            this.name = course.name
            this.num_sections = course.periods.length
        }
    }

    get cloned_from_offering() {
        return this.cloned_from && this.offerings.get(this.cloned_from.offering_id)
    }

    @computed get canCloneCourse() {
        return Boolean(
            this.cloned_from_offering && this.cloned_from_offering.is_available
        )
    }

    async save() {
        const data = extend(omit(this.toJSON(), 'term'), {
            term: this.term?.term,
            year: this.term?.year,
        })
        if (this.canCloneCourse) {
            data.cloned_from_id = this.cloned_from_id
        }
        const courseData = await this.api.request<CourseData>(
            this.canCloneCourse ? urlFor('cloneCourse', { courseId: this.cloned_from_id }) : urlFor('createCourse'),
            { data: { foo: 'bar' } },
        )
        this.onCreated(courseData)
    }

    @action onCreated(data: CourseData) {
        this.createdCourse = this.courses.addNew(data)
    }
}
