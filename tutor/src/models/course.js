import {
  BaseModel, identifiedBy, field, identifier, hasMany, session,
} from './base';
import {
  sumBy, first, sortBy, find, get, endsWith, capitalize, filter, pick,
} from 'lodash';
import { computed, action, observable } from 'mobx';
import lazyGetter from '../helpers/lazy-getter';
import { UiSettings } from 'shared';
import Period  from './course/period';
import Role    from './course/role';
import Student from './course/student';
import CourseInformation from './course/information';
import Roster from './course/roster';
import Scores from './course/scores';
import LMS from './course/lms';
import TeacherTaskPlans   from './teacher-task-plans';
import TimeHelper from '../helpers/time';
import { TimeStore } from '../flux/time';
import moment from 'moment-timezone';
import StudentTasks from './student-tasks';

const ROLE_PRIORITY = [ 'guest', 'student', 'teacher', 'admin' ];
const DASHBOARD_VIEW_COUNT_KEY = 'DBVC';

@identifiedBy('course')
export default class Course extends BaseModel {

  @identifier id;

  @field name;
  @field is_lms_enabled;

  @session appearance_code;
  @session uuid;
  @session does_cost;
  @session book_pdf_url;
  @session cloned_from_id;
  @session default_due_time;
  @session default_open_time;
  @session ecosystem_book_uuid;
  @session ecosystem_id;

  @session is_active;
  @session is_college;
  @session is_concept_coach;
  @session is_preview;
  @session offering_id;
  @session is_lms_enabling_allowed = false;
  @session is_access_switchable = true;
  @session salesforce_book_name;

  @session({ type: 'date' }) starts_at;
  @session({ type: 'date' }) ends_at;

  @session term;
  @session time_zone;
  @session webview_url;
  @session year;

  @hasMany({ model: Period, inverseOf: 'course' }) periods;
  @hasMany({ model: Role }) roles;
  @hasMany({ model: Student, inverseOf: 'course' }) students;

  constructor(attrs, map) {
    super(attrs);
    this.map = map;
  }

  @computed get num_enrolled_students() {
    return sumBy(this.periods, 'num_enrolled_students');
  }

  @computed get userStudentRecord() {
    const role = find(this.roles, 'isStudent');
    return role ? find(this.students, { role_id: role.id }) : null;
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

  @computed get studentTasks() {
    return StudentTasks.forCourseId(this.id);
  }

  @lazyGetter lms = new LMS({ course: this });
  @lazyGetter roster = new Roster({ course: this });
  @lazyGetter scores = new Scores({ course: this });

  @computed get nameCleaned() {
    const previewSuffix = ' Preview';
    if (this.is_preview && endsWith(this.name, previewSuffix)) {
      return this.name.slice(0, -previewSuffix.length);
    } else {
      return this.name;
    }
  }

  @computed get termFull() {
    return `${capitalize(this.term)} ${this.year}`;
  }

  @computed get subject() {
    return get(CourseInformation.forAppearanceCode(this.appearance_code), 'subject', '');
  }

  @computed get bookName() {
    return get(CourseInformation.forAppearanceCode(this.appearance_code), 'title', '');
  }

  @computed get bestPracticesDocumentURL() {
    return CourseInformation.bestPracticesDocumentURLFor(this.appearance_code);
  }

  @computed get bounds() {
    return {
      start: TimeHelper.getMomentPreserveDate(this.starts_at, TimeHelper.ISO_DATE_FORMAT),
      end: TimeHelper.getMomentPreserveDate(this.ends_at, TimeHelper.ISO_DATE_FORMAT),
    };
  }

  @computed get hasEnded() {
    return moment(this.ends_at).isBefore(TimeStore.getNow());
  }

  @computed get hasStarted() {
    return moment(this.starts_at).isBefore(TimeStore.getNow());
  }

  @computed get isFuture() {
    return moment(this.starts_at).isAfter(TimeStore.getNow());
  }

  @computed get isActive() {
    return !(this.hasEnded || this.isFuture);
  }

  @computed get isStudent() {
    return !!find(this.roles, 'isStudent');
  }

  @computed get isTeacher() {
    return !!find(this.roles, 'isTeacher');
  }

  @computed get taskPlans() {
    return TeacherTaskPlans.forCourseId(this.id);
  }

  @computed get needsPayment() {
    return Boolean(this.does_cost && this.userStudentRecord && this.userStudentRecord.needsPayment);
  }

  @computed get isInTrialPeriod() {
    return Boolean(this.does_cost && this.userStudentRecord && !this.userStudentRecord.isUnPaid);
  }

  @computed get archivedPeriods() {
    return filter(this.periods, period => period.is_archived);
  }

  @computed get activePeriods() {
    return filter(this.periods, period => !period.is_archived);
  }

  @computed get defaultTimes() {
    return pick(this, 'default_due_time', 'default_open_time');
  }

  @computed get tourAudienceTags() {
    let tags = [];
    if (this.isTeacher) {
      tags.push(this.is_preview ? 'teacher-preview' : 'teacher');
      if (!this.is_preview) {
        if (this.taskPlans.reading.hasPublishing) {
          tags.push('teacher-reading-published');
        }
        if (this.taskPlans.homework.hasPublishing) {
          tags.push('teacher-homework-published');
        }
      }
    }
    if (this.isStudent) { tags.push('student'); }
    return tags;
  }

  @action trackDashboardView() {
    UiSettings.set(DASHBOARD_VIEW_COUNT_KEY, this.id, this.dashboardViewCount + 1);
  }

  @computed get dashboardViewCount() {
    return UiSettings.get(DASHBOARD_VIEW_COUNT_KEY, this.id) || 0;
  }

  @computed get primaryRole() {
    return first(sortBy(this.roles, r => -1 * ROLE_PRIORITY.indexOf(r.type)));
  }

  @computed get isSunsetting() {
    return !!(this.is_concept_coach && !(
        /biology/.test(this.appearance_code) ||
        /physics/.test(this.appearance_code) ||
        /sociology/.test(this.appearance_code)
    ));
  }

  // called by API
  fetch() { }
  save() {
    return { id: this.id, data: pick(this, 'name', 'is_lms_enabled', 'time_zone') };
  }
}
