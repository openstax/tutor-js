import {
    BaseModel, ID, field, lazyGetter, model, modelize, computed, action,
    NEW_ID, array, hydrateModel, getParentOf, hydrateInstance, runInAction,
} from 'shared/model';
import {
    sumBy, first, sortBy, find, get, endsWith, capitalize, pick, filter, without,
} from 'lodash';
import urlFor from '../api'
import type { CoursesMap } from './courses-map'
import UiSettings from 'shared/model/ui-settings';
import {
    Time, Interval, Notes, CourseData, currentOfferings, Offering,
    CourseScores as Scores, CoursePeriod as Period, CourseRole as Role, CourseTeachers,
    CourseTeacher, CourseStudent, CourseTeacherStudent, CourseRoster as Roster,
    TeacherProfile, StudentTasks, PastTaskPlans, CourseLMS as LMS,
    TeacherTaskPlans, StudentTaskPlans, GradingTemplates,
    PracticeQuestions, ReferenceBook, FeatureFlags, Exercise, CourseInformation, CoursePerformance,
} from '../models'
import PH from '../helpers/period';

const ROLE_PRIORITY = [ 'guest', 'student', 'teacher', 'admin' ];
const DASHBOARD_VIEW_COUNT_KEY = 'DBVC';
const SAVEABLE_ATTRS = [
    'name', 'is_lms_enabled', 'timezone', 'default_open_time', 'default_due_time',
    'homework_weight', 'reading_weight', 'code',
];

export class Course extends BaseModel {

    @field id = NEW_ID

    @field name = ''
    @field code = ''
    @field is_lms_enabled = false

    @field appearance_code = ''
    @field uuid = ''
    @field does_cost = false
    @field book_pdf_url = ''
    @field cloned_from_id: null| ID = null
    @field default_due_time = ''
    @field default_open_time = ''
    @field ecosystem_book_uuid = ''
    @field ecosystem_id = NEW_ID
    @field is_active = false
    @field is_college = false
    @field is_concept_coach = false
    @field is_preview = false
    @field timezone = 'US/Central'
    @field offering_id = NEW_ID
    @field is_lms_enabling_allowed = false
    @field is_access_switchable = true
    @field salesforce_book_name = ''
    @field current_role_id = NEW_ID
    @model(Time) starts_at = Time.unknown
    @model(Time) ends_at = Time.unknown
    @model(CourseTeacher) teacher_record: CourseTeacher|null = null
    @model(CourseStudent) student_record: CourseStudent|null = null
    @model(CourseTeacherStudent) teacher_student_records: CourseTeacherStudent[] = []

    @field term = ''
    @field webview_url = ''
    @field year = 0

    @field homework_score_weight = 0
    @field homework_progress_weight = 0
    @field reading_score_weight = 0
    @field reading_progress_weight = 0
    @field reading_weight = 0
    @field homework_weight = 0
    @field just_created = false
    @field uses_pre_wrm_scores = false
    @field should_reuse_preview = false

    @lazyGetter get lms() { return hydrateModel(LMS, {}, this) }
    @lazyGetter get notes() { return hydrateModel(Notes, {}, this) }
    @lazyGetter get roster() { return hydrateModel(Roster, {}, this) }
    @lazyGetter get allTeachers() { return hydrateModel(CourseTeachers, {}, this) }
    @lazyGetter get scores() { return hydrateModel(Scores, {}, this) }
    @lazyGetter get performance() { return hydrateModel(CoursePerformance, {}, this) }
    @lazyGetter get studentTasks() { return hydrateModel(StudentTasks, {}, this) }
    @lazyGetter get referenceBook() { return hydrateModel(ReferenceBook, { id: this.ecosystem_id }, this) }
    @lazyGetter get pastTaskPlans() { return hydrateModel(PastTaskPlans, {}, this) }
    @lazyGetter get teacherTaskPlans() { return hydrateModel(TeacherTaskPlans, {}, this) }
    @lazyGetter get gradingTemplates() { return hydrateModel(GradingTemplates, {}, this) }
    @lazyGetter get studentTaskPlans() { return hydrateModel(StudentTaskPlans, {} , this) }
    @lazyGetter get practiceQuestions() { return hydrateModel(PracticeQuestions, {}, this) }

    @model(TeacherProfile) teacher_profiles = array((profiles: TeacherProfile[]) => ({
        get sorted() { return sortBy(profiles, 'name') },
        get current() { return find(profiles, tp => tp.isCurrentUser); },
    }))
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
        return currentOfferings.get(this.offering_id);
    }

    @computed get num_enrolled_students() {
        return sumBy(this.periods, 'num_enrolled_students');
    }

    @action clearCachedStudentData() {
        this.studentTaskPlans.reset();
        this.scores.api.reset();
        this.scores.periods.clear()
        this.studentTasks.reset();
    }
    @computed get userStudentRecord() {
        if (this.student_record && this.student_record.role_id == this.currentRole.id) {
            return this.student_record
        }

        return this.teacher_student_records.find((r) => r.role_id == this.currentRole.id) || null
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

    @computed get appearanceCode() {
        return this.appearance_code || this.offering?.appearance_code || ''
    }

    @computed get bounds() {
        return new Interval({
            start: this.dateTimeInZone(this.starts_at).startOf('day'),
            end: this.dateTimeInZone(this.ends_at).endOf('day'),
        });
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
        return !this.bounds.contains(date)
        // return (this.bounds.start.isAfter(date).startOf('day') || this.ends_at.isBefore(date))N
        // console.log(date)
        // return date.isBefore(this.starts_at.startOf('day')) || date.isAfter(this.ends_at.endOf('day'))
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
        return new Time(date).inZone(this.timezone);
    }

    @computed get tourAudienceTags() {
        let tags: string[] = [];
        if (!FeatureFlags.tours){ return tags; }

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

    @computed get saveData() {
        const attrs = this.is_access_switchable ? SAVEABLE_ATTRS : without(SAVEABLE_ATTRS, 'is_lms_enabled')
        return pick(this, attrs)
    }

    // called by API
    async fetch() {
        const data = await this.api.request<CourseData>(urlFor('fetchCourse', { courseId: this.id }))
        runInAction(() => hydrateInstance(this, data))
    }

    async save() {
        const data = await this.api.request<CourseData>(
            this.isNew ? urlFor('createCourse') : urlFor('updateCourse', { courseId: this.id }),
            { data: this.saveData },
        )
        runInAction(() => hydrateInstance(this, data))
    }

    @action async saveExerciseExclusion({ exercise, is_excluded }: { exercise: Exercise, is_excluded: boolean }) {
        exercise.is_excluded = is_excluded; // eagerly set exclusion
        const data = await this.api.request<CourseData>(
            urlFor('saveExerciseExclusion', { courseId: this.id }),
            { data: [{ id: exercise.id, is_excluded }] },
        )
        hydrateInstance(exercise, data, this)
    }

}
