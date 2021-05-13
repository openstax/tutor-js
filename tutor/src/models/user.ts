import {
    BaseModel, field, model, action, computed, observable, modelize, hydrateInstance,
    hydrateModel, array,
} from 'shared/model';
import Time from 'shared/model/time';
import { find, startsWith, map, uniq, max, remove } from 'lodash';
import UiSettings from 'shared/model/ui-settings';
import { FeatureFlags, currentCourses, Tour, Course, UserTermsMap, UserTerm } from '../models'
import ViewedTourStat from './user/viewed-tour-stat';
import { FacultyStatus, SelfReportedRoles, UserData } from './types'
import urlFor from '../api'

export interface UserEventPayload {
    category: string
    code: string
    data: any
}

console.log({ FeatureFlags, currentCourses, Tour, Course, UserTermsMap, UserTerm })

export class User extends BaseModel {

    constructor() {
        super();
        modelize(this);
    }

    get courses() { return currentCourses }

    @action.bound bootstrap(data: any) {
        hydrateInstance(this, data);
    }

    @observable csrf_token = '';

    terms = hydrateModel(UserTermsMap, {}, this);

    get id() { return this.profile_id }
    @field username = ''
    @field account_uuid = '';
    @field name = '';
    @field first_name = '';
    @field last_name = '';
    @field faculty_status: FacultyStatus = 'no_faculty_info'
    @field self_reported_role: SelfReportedRoles = 'unknown_role'
    @field profile_id = '';
    @field profile_url = '';
    @field can_create_courses = false;
    @field is_test = false;
    @field is_admin = false;
    @field is_content_analyst = false;
    @field is_customer_service = false;
    @model(UserTerm) available_terms = array<UserTerm>()

    @model(ViewedTourStat) viewed_tour_stats = array<ViewedTourStat>()
    @model(Time) created_at = Time.unknown;

    @computed get firstName() {
        return this.first_name || (this.name ? this.name.replace(/ .*/, '') : '');
    }

    @computed get lastName() {
        return this.last_name || (this.name ? this.name.replace(/.* /, '') : '');
    }

    @computed get initials() {
        let initials = [];
        if (this.firstName) { initials.push(this.firstName[0]); }
        if (this.lastName)  { initials.push(this.lastName[0]); }
        return initials.join(' ');
    }

    @computed get canAnnotate() {
        return !!find(this.courses.nonPreview.active.array, { canAnnotate: true });
    }

    @computed get hasPreviewed() {
        return this.courses.teaching.preview.any && this.courses.teaching.preview.isViewed.any;
    }

    @computed get shouldPreview() {
        const exploreViewStats = this.viewed_tour_stats.find((stat) => stat.id === 'explore-a-preview');
        if (exploreViewStats) {
            return exploreViewStats.view_count < 4;
        }
        return true;
    }

    @computed get isConfirmedFaculty() {
        return this.faculty_status === 'confirmed_faculty';
    }

    @computed get canViewPreviewCourses() {
        return Boolean(this.can_create_courses);
    }

    @computed get canCreateCourses() {
        return Boolean(this.can_create_courses);
    }

    @computed get wasNewlyCreated() {
        return this.created_at.distanceToNow('day') > -2
    }

    @computed get isProbablyTeacher() {
        return Boolean(this.can_create_courses || this.isConfirmedFaculty || this.self_reported_role === 'instructor' || this.courses.teaching.any);
    }

    @computed get tourAudienceTags() {
        let tags:string[] = [];
        if (!FeatureFlags.tours){ return tags; }

        if (
            (this.courses.active.isEmpty && this.canCreateCourses) ||
          this.courses.active.teaching.nonPreview.any
        ) {
            tags.push('teacher');
        } else if (this.courses.active.teaching.any) {
            tags.push('teacher-preview');
        }

        if (
            this.courses.teaching.any &&
          this.hasPreviewed &&
          this.courses.teaching.nonPreview.isEmpty
        ) {
        // Teacher has previewed a course but has no active real course.
        // This means the teacher needs a reminder about how to create a course.
            tags.push('teacher-need-real');
        } else if (find(tags, tag => startsWith(tag, 'teacher'))) {
            if (this.shouldPreview && !this.hasPreviewed) {
                // Otherwise, the teacher may need to preview a course
                tags.push('teacher-not-previewed');
            }
        }
        return tags;
    }

    resetTours() {
        this.viewed_tour_stats.clear()
    }

    replayTour(tour: Tour) {
        remove(this.viewed_tour_stats, { id: tour.id })
    }

    viewedTour(tour: Tour, options:any = {}) {
        let stats = this.viewed_tour_stats.find((stat) => stat.id === tour.countId);

        if (stats) {
            stats.view_count ++;
        } else {
            stats = hydrateModel(ViewedTourStat, { id: tour.countId }, this);
            this.viewed_tour_stats.push(stats);
        }

        this.saveTourView(stats, options);
    }

    verifiedRoleForCourse(course: Course) {
        return this.isConfirmedFaculty && course.primaryRole ? course.primaryRole.type : 'student';
    }

    async saveTourView(stat: ViewedTourStat, options: any) {
        await this.api.request<Tour>(urlFor('saveTourView',{ tourId: stat.id }), { data: options })
    }

    @computed get isUnverifiedInstructor() {
        return !this.canCreateCourses && !this.isConfirmedFaculty && this.self_reported_role === 'instructor';
    }

    recordSessionStart() {
        UiSettings.set('sessionCount', this.sessionCount + 1);
    }

    get sessionCount() {
        return UiSettings.get('sessionCount') || 0;
    }

    async logEvent({ category, code, data }: UserEventPayload) {
        if (!this.isProbablyTeacher) { return false }
        return await this.api.request(urlFor('logUserEvent', { category, code }), { data })
    }

    async suggestSubject({ subject }: { subject: string }) {
        // students do not submit suggestions
        if (this.self_reported_role === 'student') { return 'ABORT'; }
        return this.api.request(urlFor('suggestCourseSubject'), { data: { subject } })
    }

    @computed get metrics() {
        const courses = this.courses.nonPreview.array;
        const getValues = (attr: any) => uniq(map(courses, attr)).join(';');
        return {
            role: this.isProbablyTeacher ? 'instructor' : 'student',
            is_new_user: this.courses.completed.nonPreview.isEmpty,
            is_test_user: this.is_test,
            has_viewed_preview: this.courses.preview.any,
            has_per_cost_course: Boolean(find(courses, 'does_cost')),
            course_subjects: getValues('appearance_code'),
            course_types: getValues((c:Course) => c.is_preview ? 'preview' : 'real'),
            course_roles: getValues('currentRole.type'),
            course_enrollment_types: getValues((c:Course) => c.is_lms_enabled ? 'lms' : 'links'),
            max_course_enrollment: max(courses.map((c:Course) => c.currentRole.isTeacher ? c.num_enrolled_students : -1)),
        };
    }

    async fetch() {
        const data = await this.api.request<UserData>(urlFor('fetchUser', { courseId: this.id }))
        this.update(data)
    }
}

export const currentUser = new User();
