import React from 'react';
import {
    BaseModel, field, computed, action, when, observable, modelize,
    NEW_ID, ID, hydrateModel, runInAction,
} from 'shared/model';
import { get, pick, isEmpty } from 'lodash';
import { Redirect } from 'react-router-dom';
import { CoursePeriod, Course, currentUser, currentCourses } from '../models'
import S from '../helpers/string';
import Router from '../helpers/router';
import Activity from 'shared/components/staxly-animation';
import Enroll from '../components/enroll';
import urlFor from '../api';
import { ApiErrorData, isApiError } from 'shared/api/request';
import type { User, CoursesMap } from '../models';
import { CourseData } from '../models/types';

export class CourseEnrollment extends BaseModel {

    @field id: ID = NEW_ID
    @field enrollment_code = ''

    @field student_identifier = ''
    @observable pendingEnrollmentCode = ''
    @observable originalEnrollmentCode = ''
    @observable to: any = {}
    @observable status = ''
    @observable isComplete = false
    @observable courseToJoin: Course|null = null
    @observable isLoadingCourses = false
    @observable courses: CoursesMap
    @observable user: User
    history?: any

    constructor(attrs: { user:User, courses: CoursesMap }) {
        super()
        modelize(this)
        Object.assign(this, attrs)
        this.user = attrs.user || currentUser
        this.courses = attrs.courses || currentCourses
        this.originalEnrollmentCode = this.enrollment_code
        when(
            () => this.isRegistered,
            () => this.fetchCourses(),
        )
    }

    @computed get bodyContents() {
        if (currentUser.terms.areSignaturesNeeded) {
            return null
        }

        if (this.isLoading) {
            return <Activity isLoading={true} />
        } else if (this.isFromLms && false === this.courseIsLmsEnabled) {
            return this.renderComponent('invalidLMS')
        } else if (!this.isFromLms && true === this.courseIsLmsEnabled) {
            return this.renderComponent('invalidLinks')
        } else if (this.isTeacher) {
            return this.renderComponent('invalidTeacher')
        } else if (this.isInvalid) {
            return this.renderComponent('invalidCode')
        } else if (this.isComplete) {
            if (this.courseId) {
                return <Redirect to={Router.makePathname('dashboard', { courseId: this.courseId })} />
            } else {
                // the BE says we're registered but we didn't find the course
                // most likely because they're coming from LMS or have a non-standard enrollment
                return <Redirect to={Router.makePathname('myCourses')} />
            }
        } else if (this.api.errors.any) {
            if (this.error?.code == 'dropped_student') {
                return this.renderComponent('droppedStudent')
            } else if (this.error?.code == 'course_ended') {
                return this.renderComponent('courseEnded')
            } else {
                return this.renderComponent('unknownError')
            }
        } else if (this.needsPeriodSelection) {
            return this.renderComponent('selectPeriod')
        } else {
            return this.renderComponent('studentIDForm')
        }
    }

    @computed get error(): ApiErrorData | undefined {
        return get(this.api.errors.get('courseEnroll'), 'data')
    }

    renderComponent(name: string) {
        const Tag = Enroll.Components[name]
        return <Tag enrollment={this} errors={this.api.errors} />
    }

    @action.bound selectPeriod(period: CoursePeriod) {
        this.pendingEnrollmentCode = period.enrollment_code
    }

    @computed get periodIsSelected() {
        return Boolean(this.pendingEnrollmentCode)
    }

    @action.bound onSubmitPeriod() {
        this.courseToJoin = null
        this.enrollment_code = this.pendingEnrollmentCode
        this.create()
    }

    @computed get courseIsLmsEnabled(): boolean {
        return this.courseToJoin ? this.courseToJoin.is_lms_enabled : get(this, 'to.course.is_lms_enabled', false)
    }

    @action.bound onCancel() {
        this.history.push(Router.makePathname('myCourses'))
    }

    @action.bound onCancelStudentId() {
        this.student_identifier = ''
        this.confirm()
    }

    @action.bound onStudentIdContinue() {
        this.confirm()
    }

    @computed get courseName(): string {
        if (this.isTeacher) {
            return this.error?.data?.course_name || ''
        }
        return this.to?.course?.name || ''
    }

    @computed get course() {

        return this.courses.array.find(c =>
            c.periods.find(p =>
                p.enrollment_code == this.enrollment_code
            )
        )
    }

    @computed get courseId(): ID {
        return get(this, 'to.course.id', this.course ? this.course.id : '')
    }

    @computed get isPending() {
        return Boolean(!this.api.errors.any && isEmpty(this.to))
    }

    @computed get isInvalid() {
        return Boolean(this.api.errors.withCode('invalid_enrollment_code'))
    }

    @computed get isTeacher() {
        return this.error?.code == 'is_teacher'
    }

    @computed get isRegistered() {
        return Boolean(this.error?.code == 'already_enrolled' || this.status == 'processed')
    }

    @computed get isLoading() {
        return Boolean(this.api.isPending || this.isLoadingCourses)
    }

    @computed get needsPeriodSelection() {
        return Boolean(this.isFromLms && S.isUUID(this.enrollment_code))
    }

    @computed get isFromLms() {
        return S.isUUID(this.originalEnrollmentCode)
    }

    async fetchCourses() {
        this.isLoadingCourses = true
        await this.courses.fetch()
        runInAction(() => {
            if (this.course) { // should always be set but maybe the BE messes up and doesn't return the new course yet?
                this.course.studentTaskPlans.expecting_assignments_count = get(this, 'to.period.assignments_count', 0)
            }
            this.isLoadingCourses = false
            this.isComplete = true
            // enrolling in a course may trigger new terms
            this.user.terms.fetch()
        })
    }

    // called by api
    @action async create() {
        if (this.needsPeriodSelection) {
            this.courseToJoin = new Course()
            const courseData = await this.api.request<CourseData>(
                urlFor('fetchEnrollmentChoices', { enrollmentCode: this.originalEnrollmentCode }),
            )
            this.courseToJoin = hydrateModel(Course, courseData)
            if (this.courseToJoin.periods.length == 1) {
                this.enrollment_code = this.courseToJoin.periods[0].enrollment_code
            } else {
                return
            }
        }
        const data = await this.api.request(
            urlFor('courseEnroll' ),
            { data: pick(this, 'enrollment_code'), nothrow: true }
        )
        if (!isApiError(data)) {
            this.update(data)
        }
    }

    @action onEnrollmentCreate(data: any) {
        if (this.needsPeriodSelection) {
            const c = hydrateModel(Course, data)
            this.courseToJoin = c
            if (this.courseToJoin.periods.length == 1) {
                this.enrollment_code = this.courseToJoin.periods[0].enrollment_code
                this.create()
            }
        } else {
            this.update(data)
        }
    }

    async confirm() {
        const result = await this.api.request( urlFor('confirmCourseEnroll', { enrollmentId: this.id }), { data: pick(this, 'student_identifier') } )
        this.update(result)
    }
}
