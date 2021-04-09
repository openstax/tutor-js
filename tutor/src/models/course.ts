import {
    BaseModel, ID, field, lazyGetter, model, modelize, computed, action,
    NEW_ID, array, hydrateModel, getParentOf, hydrateInstance, runInAction,
} from 'shared/model';
import {
    sumBy, first, sortBy, find, get, endsWith, capitalize, pick, isEmpty, filter,
} from 'lodash';
import urlFor from '../api'
import type { CoursesMap } from './courses-map'
import UiSettings from 'shared/model/ui-settings';
import Offerings, { Offering } from './course/offerings';
import Period  from './course/period';
import Role    from './course/role';
import Student from './course/student';
import CourseInformation from './course/information';
import Roster from './course/roster';
import Scores from './scores';
import LMS from './course/lms';
import PH from '../helpers/period';
import { TeacherProfile } from './course/teacher-profile'
import { StudentTasks } from './student-tasks';
import { StudentTaskPlans } from './task-plans/student';
import { TeacherTaskPlans } from './task-plans/teacher';
import { PastTaskPlans } from './task-plans/teacher/past';
import { Notes } from './notes';
import Time from 'shared/model/time'
import { GradingTemplates } from './grading/templates';
import { PracticeQuestions } from './practice-questions';
import ReferenceBook from './reference-book';
import Flags from './feature_flags';
import { CourseObj } from './types';
import Exercise from './exercises/exercise'

const ROLE_PRIORITY = [ 'guest', 'student', 'teacher', 'admin' ];
const DASHBOARD_VIEW_COUNT_KEY = 'DBVC';
const SAVEABLE_ATTRS = [
    'name', 'is_lms_enabled', 'timezone', 'default_open_time', 'default_due_time',
    'homework_weight', 'reading_weight', 'code',
];

export default class Course extends BaseModel {

    @field id = NEW_ID;

    @field name = '';
    @field code = '';
    @field is_lms_enabled = false;

    @field appearance_code = '';
    @field uuid = '';
    @field does_cost = false;
    @field book_pdf_url = '';
    @field cloned_from_id: null| ID = null
    @field default_due_time = '';
    @field default_open_time = '';
    @field ecosystem_book_uuid = '';
    @field ecosystem_id = NEW_ID;
    @model(TeacherProfile) teacher_profiles:TeacherProfile[] = [];

    @field is_active = false;
    @field is_college = false;
    @field is_concept_coach = false;
    @field is_preview = false;
    @field timezone = 'US/Central';
    @field offering_id = NEW_ID;
    @field is_lms_enabling_allowed = false;
    @field is_access_switchable = true;
    @field salesforce_book_name = '';
    @field current_role_id = NEW_ID;
    @model(Time) starts_at = Time.unknown;
    @model(Time) ends_at = Time.unknown;

    @field term = '';
    @field webview_url = '';
    @field year = 0;

    @field homework_score_weight = 0;
    @field homework_progress_weight = 0;
    @field reading_score_weight = 0;
    @field reading_progress_weight = 0;
    @field reading_weight = 0;
    @field homework_weight = 0;
    @field just_created = false;
    @field uses_pre_wrm_scores = false;
    @field should_reuse_preview = false;

    @lazyGetter get lms() { return hydrateModel(LMS, {}, this) }
    @lazyGetter get notes() { return hydrateModel(Notes, {}, this) }
    @lazyGetter get roster() { return hydrateModel(Roster, {}, this) }
    @lazyGetter get scores() { return hydrateModel(Scores, {}, this) }
    @lazyGetter get studentTasks() { return hydrateModel(StudentTasks, {}, this) }
    @lazyGetter get referenceBook() { return hydrateModel(ReferenceBook, { id: this.ecosystem_id }, this) }
    @lazyGetter get pastTaskPlans() { return hydrateModel(PastTaskPlans, {}, this) }
    @lazyGetter get teacherTaskPlans() { return hydrateModel(TeacherTaskPlans, {}, this) }
    @lazyGetter get gradingTemplates() { return hydrateModel(GradingTemplates, {}, this) }
    @lazyGetter get studentTaskPlans() { return hydrateModel(StudentTaskPlans, {} , this) }
    @lazyGetter get practiceQuestions() { return hydrateModel(PracticeQuestions, {}, this) }

    @model(Period) periods = array((a: Period[]) => ({
        get sorted() { return PH.sort(a) },
        get archived() { return filter(this.sorted, period => !period.is_archived) },
        get active() { return filter(this.sorted, 'isActive') },
    }))

    @model(Role) roles = array((roles: Role[]) => ({
        get student() { return find(roles, { isStudent: true }); },
        get teacher() { return find(roles, { isTeacher: true }); },
        get teacherStudent() { return find(roles, { isTeacherStudent: true }); },
    }))

    @model(Student) students: Student[] = [];

    get otherCourses():CoursesMap { return getParentOf(this) }

    constructor() {
        super()
        modelize(this);
    }

    @computed get defaultTimes() {
        const opens = this.default_open_time.split(':').map(Number)
        const due = this.default_due_time.split(':').map(Number)
        return {
            due: { hour: due[0], minute: due[1] },
            opens: { hour: opens[0], minute: opens[1] },
        }
    }

    @computed get sortKey() {
        return this.primaryRole?.joined_at || Time.unknown;
    }

    @computed get offering() {
        return Offerings.get(this.offering_id);
    }

    @computed get num_enrolled_students() {
        return sumBy(this.periods, 'num_enrolled_students');
    }

    @action clearCachedStudentData() {
        this.studentTaskPlans.reset();
        this.scores.api.reset();
        this.scores.periods.reset();
        this.studentTasks.reset();
    }
    @computed get userStudentRecord() {
        const role = this.roles.student || this.roles.teacherStudent;
        return role ? find(this.students, { role_id: role.id }) : null;
    }

    @computed get currentRole() {
        if (this.current_role_id) {
            return find(this.roles, { id: this.current_role_id }) as Role;
        }
        return this.primaryRole;
    }

    @computed get canOnlyUseEnrollmentLinks() {
        return Boolean(
            !this.is_lms_enabling_allowed || (
                !this.is_lms_enabled && !this.is_access_switchable
            )
        );
    }

    @computed get canOnlyUseLMS() {
        return Boolean(
            this.is_lms_enabled && !this.is_access_switchable
        );
    }

    @computed get nameCleaned() {
        const previewSuffix = ' Preview';
        if (this.is_preview && endsWith(this.name, previewSuffix)) {
            return this.name.slice(0, -previewSuffix.length);
        } else {
            return this.name;
        }
    }

    @computed get isCloned() {
        return Boolean(this.cloned_from_id);
    }

    @computed get isWRM() {
        return !this.uses_pre_wrm_scores;
    }

    @computed get termFull() {
        return `${capitalize(this.term)} ${this.year}`;
    }

    @computed get subject() {
        return CourseInformation.information(this.appearanceCode);
    }

    @computed get bookName() {
        return get(CourseInformation.information(this.appearanceCode), 'title', '');
    }

    @computed get bestPracticesDocumentURL() {
        return CourseInformation.bestPracticesDocumentURLFor(this.appearanceCode);
    }

    @computed get appearanceCode() {
        return this.appearance_code || this.offering?.appearance_code || ''
    }

    @computed get bounds() {
        return {
            start: this.dateTimeInZone(this.starts_at).startOf('day'),
            end: this.dateTimeInZone(this.ends_at).endOf('day'),
        };
    }

    @computed get hasEnded() {
        return this.ends_at.isInPast
    }

    @computed get allowedAssignmentDateRange() {
        return {
            start: this.starts_at.plus({ day: 1 }).endOf('day'),
            end: this.ends_at.minus({ day: 1 }).startOf('day'),
        };
    }

    // bind to this so it can be used in disabledDate check
    isInvalidAssignmentDate = (date: Time) => {
        return date.isBefore(this.starts_at.startOf('day')) || date.isAfter(this.ends_at.endOf('day'))
    }

    @computed get hasStarted() {
        return this.starts_at.isInPast
    }

    @computed get isFuture() {
        return this.starts_at.isInFuture
    }

    @computed get isActive() {
        return !(this.hasEnded || this.isFuture);
    }

    @computed get shouldRemindNewEnrollmentLink() {
        return Boolean(
            !this.is_preview &&
                !this.is_lms_enabled &&
                (this.just_created || this.dashboardViewCount <= 1) &&
                this.otherCourses && this.otherCourses.nonPreview.previouslyCreated.any &&
                (this.isActive || this.isFuture)
        );
    }

    // at one time we only allowed annotating current courses
    // this provides a spot where we can restrict it in the future if needed
    @computed get canAnnotate() {
        return true;
    }

    @computed get needsPayment() {
        return Boolean(this.does_cost && this.userStudentRecord && this.userStudentRecord.needsPayment);
    }

    @computed get isInTrialPeriod() {
        return Boolean(this.does_cost && this.userStudentRecord && !this.userStudentRecord.isUnPaid);
    }

    dateTimeInZone(date:Time = Time.now) {
        return date.inZone(this.timezone);
    }

    @computed get tourAudienceTags() {
        let tags: string[] = [];
        if (!Flags.tours){ return tags; }

        if (this.currentRole.isTeacher) {
            tags.push(this.is_preview ? 'teacher-preview' : 'teacher');
            if (!this.is_preview) {
                if (this.teacherTaskPlans.reading.hasPublishing) {
                    tags.push('teacher-reading-published');
                }
                if (this.teacherTaskPlans.homework.hasPublishing) {
                    tags.push('teacher-homework-published');
                }
                if (this.shouldRemindNewEnrollmentLink) {
                    tags.push('teacher-with-previous-courses');
                }
            }
        }

        if (this.currentRole.isStudentLike) { tags.push('student'); }
        return tags;
    }

    isBeforeTerm(term: string, year: number) {
        if (this.year === year) {
            return Boolean(
                Offering.possibleTerms.indexOf(this.term) < Offering.possibleTerms.indexOf(term)
            );
        }
        return (this.year < year);
    }

    @action trackDashboardView() {
        UiSettings.set(DASHBOARD_VIEW_COUNT_KEY, this.id, this.dashboardViewCount + 1);
    }

    @computed get dashboardViewCount() {
        return UiSettings.get(DASHBOARD_VIEW_COUNT_KEY, this.id) || 0;
    }

    @computed get primaryRole() {
        return first(sortBy(this.roles, r => -1 * ROLE_PRIORITY.indexOf(r.type))) as Role;
    }

    @computed get currentUser() {
        return find(this.teacher_profiles, tp => tp.isCurrentUser);
    }

    @computed get currentCourseTeacher() {
        const teacherRole = find(this.roles, r => r.type === 'teacher');
        if(!this.roster || isEmpty(this.roster.teachers) || !teacherRole) {
            return null;
        }
        return find(this.roster.teachers, t => t.role_id === teacherRole.id);
    }

    // called by API
    async fetch() {
        const data = await this.api.request<CourseObj>(urlFor('fetchCourse', { courseId: this.id }))
        runInAction(() => hydrateInstance(this, data))
    }

    async save() {
        const data = await this.api.request<CourseObj>(
            this.isNew ? urlFor('createCourse') : urlFor('updateCourse', { courseId: this.id }),
            { data: pick(this, SAVEABLE_ATTRS) },
        )
        runInAction(() => hydrateInstance(this, data))
    }

    async saveExerciseExclusion({ exercise, is_excluded }: { exercise: Exercise, is_excluded: boolean }) {
        exercise.is_excluded = is_excluded; // eagerly set exclusion
        const data = await this.api.request(
            urlFor('saveExerciseExclusion', { courseId: this.id }),
            { data: [{ id: exercise.id, is_excluded }] },
        )
        runInAction(() => hydrateInstance(exercise, data, this))
    }

}
