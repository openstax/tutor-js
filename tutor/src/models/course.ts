import {
    BaseModel, modelize, model, field, NEW_ID, ID, computed, action, lazyGetter,// model,
} from 'shared/model';
import { CourseObj, CourseTerm } from './types'
import Api from '../api'

import {
    pick,
    //    sumBy, first, sortBy, find, get, endsWith, capitalize, pick, isEmpty,
} from 'lodash';
// import { computed, action } from 'mobx';
// import UiSettings from 'shared/model/ui-settings';
// import Offerings, { Offering } from './course/offerings';
// import { CoursePeriods } from './course/period';
// import Student from './course/student';
// import CourseInformation from './course/information';
// import Roster from './course/roster';
// import TeacherProfile from './course/teacher-profiles';
// import Scores from './scores';
// import LMS from './course/lms';
import { CourseRoles } from './course/role'
import { Students } from './course/student'
import { DateTime } from './date-time'
// import TimeHelper from '../helpers/time';

// //import { getters } from '../helpers/computed-property';

// import { StudentTasks } from './student-tasks';
// import { StudentTaskPlans } from './task-plans/student';
// import { TeacherTaskPlans } from './task-plans/teacher';
// import { PastTaskPlans } from './task-plans/teacher/past';
// import { Notes } from './notes';
// import { GradingTemplates } from './grading/templates';
// import { PracticeQuestions } from './practice-questions';
// import ReferenceBook from './reference-book';
// import Flags from './feature_flags';

// const DASHBOARD_VIEW_COUNT_KEY = 'DBVC';
const SAVEABLE_ATTRS = [
    'name', 'is_lms_enabled', 'timezone', 'default_open_time', 'default_due_time',
    'homework_weight', 'reading_weight', 'code',
];

export class Course extends BaseModel {

    @field name = '';
    @field code = '';
    @field is_lms_enabled = false;
    @field appearance_code = '';
    @field uuid = '';
    @field does_cost = false;
    @field book_pdf_url = '';
    @field cloned_from_id = NEW_ID;

    @field default_due_time = '';
    @field default_open_time = '';
    @field ecosystem_book_uuid = '';
    @field ecosystem_id = NEW_ID;
    //    @field teacher_profiles = '';

    @field is_active = false;
    @field is_college = false;
    @field is_preview = false;
    @field timezone = 'US/Central';
    @field offering_id = NEW_ID;
    @field is_lms_enabling_allowed = false;
    @field is_access_switchable = true;
    @field salesforce_book_name = '';
    @field current_role_id: ID = NEW_ID;
    @field starts_at = '';
    @model(DateTime) ends_at = DateTime.unknown

    @field term: CourseTerm = 'unknown';
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

    // @lazyGetter() get lms() { return new LMS({ course: this }) };
    // @lazyGetter() get roster() { return new Roster({ course: this }); }
    // @lazyGetter() get scores() { return new Scores({ course: this }); }
    // @lazyGetter() get notes() { return new Notes({ course: this }); }
    // @lazyGetter() get referenceBook() { return new ReferenceBook({ id: this.ecosystem_id }); }
    // @lazyGetter() get studentTaskPlans() { return new StudentTaskPlans({ course: this }); }
    // @lazyGetter() get teacherTaskPlans() { return new TeacherTaskPlans({ course: this }); }
    // @lazyGetter() get pastTaskPlans() { return new PastTaskPlans({ course: this }); }
    // @lazyGetter() get studentTasks() { return new StudentTasks({ course: this }); }
    // @lazyGetter() get gradingTemplates() { return new GradingTemplates({ course: this }); }
    // @lazyGetter() get practiceQuestions() { return new PracticeQuestions({ course: this }); }
    // @lazyGetter() get periods() { return new CoursePeriods(this) }
    @lazyGetter() get roles() { return new CourseRoles(this) }

    @lazyGetter() get students() { return new Students(this) }

    // @model(Student) students: Student[] = []

    // @model(TeacherProfile) teacher_profiles: TeacherProfile[] = []

    // // @hasMany({ model: Student, inverseOf: 'course' }) students;
    // // @hasMany({ model: TeacherProfiles, inverseOf: 'course' }) teacher_profiles;
    map!: Map<number, Course>;

    constructor() {
        super();
        modelize(this)

    }

    @computed get userStudentRecord() {
        const role = this.roles.student || this.roles.teacherStudent;
        return role ? this.students.all.find(s => s.role_id == role.id) : null;
    }

    @computed get sortKey() {
        return this.roles.primary.joined_at;
    }

    // @computed get offering() {
    //     return Offerings.get(this.offering_id);
    // }

    // @computed get num_enrolled_students() {
    //     return sumBy(this.periods, 'num_enrolled_students');
    // }

    @action clearCachedStudentData() {
        // this.studentTaskPlans.reset();
        // this.scores.api.reset();
        // this.scores.periods.reset();
        // this.studentTasks.reset();
    }

    async save() {
        const course = await this.api.request<CourseObj>(
            Api.updateCourse({ courseId: this.id }),
            pick(this, SAVEABLE_ATTRS),
        )
        this.update(course)
        return this
    }


    // @computed get canOnlyUseEnrollmentLinks() {
    //     return Boolean(
    //         !this.is_lms_enabling_allowed || (
    //             !this.is_lms_enabled && !this.is_access_switchable
    //         )
    //     );
    // }

    // @computed get canOnlyUseLMS() {
    //     return Boolean(
    //         this.is_lms_enabled && !this.is_access_switchable
    //     );
    // }

    // @computed get nameCleaned() {
    //     const previewSuffix = ' Preview';
    //     if (this.is_preview && endsWith(this.name, previewSuffix)) {
    //         return this.name.slice(0, -previewSuffix.length);
    //     } else {
    //         return this.name;
    //     }
    // }

    // @computed get isCloned() {
    //     return Boolean(this.cloned_from_id);
    // }

    // @computed get isWRM() {
    //     return !this.uses_pre_wrm_scores;
    // }

    // @computed get termFull() {
    //     return `${capitalize(this.term)} ${this.year}`;
    // }

    // @computed get subject() {
    //     return CourseInformation.information(this.appearanceCode);
    // }

    // @computed get bookName() {
    //     return get(CourseInformation.information(this.appearanceCode), 'title', '');
    // }

    // @computed get bestPracticesDocumentURL() {
    //     return CourseInformation.bestPracticesDocumentURLFor(this.appearanceCode);
    // }

    // @computed get appearanceCode() {
    //     return this.appearance_code || this.offering?.appearance_code || ''
    // }

    // @computed get bounds() {
    //     return {
    //         start: TimeHelper.getMomentPreserveDate(this.starts_at, TimeHelper.ISO_DATE_FORMAT),
    //         end: TimeHelper.getMomentPreserveDate(this.ends_at, TimeHelper.ISO_DATE_FORMAT),
    //     };
    // }

    @computed get hasEnded() {
        return this.ends_at.isInPast
    }

    @computed get allowedAssignmentDateRange() {
        return {
            start: this.momentInZone(this.starts_at).add(1, 'day').endOf('day'),
            end: this.momentInZone(this.ends_at).subtract(1, 'day').startOf('day'),
        };
    }

    // // bind to this so it can be used in disabledDate check
    // isInvalidAssignmentDate = (date) => {
    //     return date < moment(this.starts_at).endOf('day') ||
    //         date > moment(this.ends_at).endOf('day');
    // }

    // @computed get hasStarted() {
    //     return moment(this.starts_at).isBefore(Time.now);
    // }

    // @computed get isFuture() {
    //     return moment(this.starts_at).isAfter(Time.now);
    // }

    // @computed get isActive() {
    //     return !(this.hasEnded || this.isFuture);
    // }

    // @computed get shouldRemindNewEnrollmentLink() {
    //     return Boolean(
    //         !this.is_preview &&
    //         !this.is_lms_enabled &&
    //         (this.just_created || this.dashboardViewCount <= 1) &&
    //         this.map && this.map.nonPreview.previouslyCreated.any &&
    //         (this.isActive || this.isFuture)
    //     );
    // }

    // // at one time we only allowed annotating current courses
    // // this provides a spot where we can restrict it in the future if needed
    // @computed get canAnnotate() {
    //     return true;
    // }

    // @computed get needsPayment() {
    //     return Boolean(this.does_cost && this.userStudentRecord && this.userStudentRecord.needsPayment);
    // }

    // @computed get isInTrialPeriod() {
    //     return Boolean(this.does_cost && this.userStudentRecord && !this.userStudentRecord.isUnPaid);
    // }

    // momentInZone(date) {
    //     return moment.tz(date, this.timezone);
    // }

    // @computed get tourAudienceTags(): string[] {
    //     let tags: string[] = [];
    //     if (!Flags.tours) { return tags; }

    //     if (this.currentRole.isTeacher) {
    //         tags.push(this.is_preview ? 'teacher-preview' : 'teacher');
    //         if (!this.is_preview) {
    //             if (this.teacherTaskPlans.reading.hasPublishing) {
    //                 tags.push('teacher-reading-published');
    //             }
    //             if (this.teacherTaskPlans.homework.hasPublishing) {
    //                 tags.push('teacher-homework-published');
    //             }
    //             if (this.shouldRemindNewEnrollmentLink) {
    //                 tags.push('teacher-with-previous-courses');
    //             }
    //         }
    //     }

    //     if (this.currentRole.isStudentLike) { tags.push('student'); }
    //     return tags;
    // }

    // isBeforeTerm(term, year) {
    //     if (this.year === year) {
    //         return Boolean(
    //             Offering.possibleTerms.indexOf(this.term) < Offering.possibleTerms.indexOf(term)
    //         );
    //     }
    //     return (this.year < year);
    // }

    // @action trackDashboardView() {
    //     UiSettings.set(DASHBOARD_VIEW_COUNT_KEY, this.id, this.dashboardViewCount + 1);
    // }

    // @computed get dashboardViewCount() {
    //     return UiSettings.get(DASHBOARD_VIEW_COUNT_KEY, this.id) || 0;
    // }


    // @computed get currentUser() {
    //     return find(this.teacher_profiles, tp => tp.isCurrentUser);
    // }

    // @computed get currentCourseTeacher() {
    //     const teacherRole = find(this.roles, r => r.type === 'teacher');
    //     if (!this.roster || isEmpty(this.roster.teachers) || !teacherRole) {
    //         return null;
    //     }

    //     return find(this.roster.teachers, t => t.role_id === teacherRole.id);
    // }

    // // called by API
    // fetch() { }
    // save() {
    //     return { id: this.id, data: pick(this, SAVEABLE_ATTRS) };
    // }

    // saveExerciseExclusion({ exercise, is_excluded }) {
    //     exercise.is_excluded = is_excluded; // eagerly set exclusion
    //     return { data: [{ id: exercise.id, is_excluded }] };
    // }
    // onExerciseExcluded({ data: [exerciseAttrs] }, [{ exercise }]) {
    //     exercise.update(exerciseAttrs);
    // }
}
