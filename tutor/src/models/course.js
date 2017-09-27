import {
  BaseModel, identifiedBy, field, identifier, hasMany,
} from './base';
import { computed, action, observable } from 'mobx';
import { first, sortBy, find, get, endsWith, capitalize, filter, pick } from 'lodash';
import { UiSettings } from 'shared';
import Period  from './course/period';
import Role    from './course/role';
import Student from './course/student';
import CourseInformation from './course/information';
import Roster from './course/roster';
import Scores from './course/scores';
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

  @field appearance_code;
  @field name;
  @field uuid;
  @field does_cost;
  @field book_pdf_url;
  @field cloned_from_id;
  @field default_due_time;
  @field default_open_time;
  @field ecosystem_book_uuid;
  @field ecosystem_id;
  @field is_active;
  @field is_college;
  @field is_concept_coach;
  @field is_preview;
  @field num_sections;
  @field offering_id;
  @field is_lms_enabling_allowed;
  @field is_lms_enabled;
  @field salesforce_book_name;

  @field({ type: 'date' }) starts_at;
  @field({ type: 'date' }) ends_at;

  @field term;
  @field time_zone;
  @field webview_url;
  @field year;

  @hasMany({ model: Period, inverseOf: 'course' }) periods;
  @hasMany({ model: Role }) roles;
  @hasMany({ model: Student, inverseOf: 'course' }) students;

  @computed get userStudentRecord() {
    const role = find(this.roles, 'isStudent');
    return role ? find(this.students, { role_id: role.id }) : null;
  }

  @computed get studentTasks() {
    return StudentTasks.forCourseId(this.id);
  }

  @observable _roster;
  get roster() {
    return this._roster || ( this._roster = new Roster(this) );
  }

  @observable _scores;
  get scores() {
    return this._scores || ( this._scores = new Scores(this) );
  }

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

  save() {
    return { id: this.id, data: pick(this, 'name') };
  }
}
