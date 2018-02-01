import {
  BaseModel, identifiedBy, field, identifier, hasMany,
} from './base';
import {
  sumBy, first, sortBy, find, get, endsWith, capitalize, filter, pick,
} from 'lodash';
import { computed, action, observable } from 'mobx';
import lazyGetter from '../helpers/lazy-getter';
import { UiSettings } from 'shared';
import Offering from './course/offerings/offering';
import Period  from './course/period';
import Role    from './course/role';
import Student from './course/student';
import CourseInformation from './course/information';
import Roster from './course/roster';
import Scores from './course/scores';
import LMS from './course/lms';
import PH from '../helpers/period';
import TimeHelper from '../helpers/time';
import FeatureFlags from './feature_flags';
import { TimeStore } from '../flux/time';
import { extendHasMany } from '../helpers/computed-property';
import moment from 'moment-timezone';
import StudentTasks from './student-tasks';
import TeacherTaskPlans from './course/task-plans';
import ReferenceBook from './reference-book';

const ROLE_PRIORITY = [ 'guest', 'student', 'teacher', 'admin' ];
const DASHBOARD_VIEW_COUNT_KEY = 'DBVC';
const SAVEABLE_ATTRS = [
  'name', 'is_lms_enabled', 'time_zone', 'default_open_time', 'default_due_time',
  'homework_score_weight', 'homework_progress_weight',
  'reading_score_weight', 'reading_progress_weight',
];

@identifiedBy('course')
export default class Course extends BaseModel {

  @identifier id;

  @field name;
  @field is_lms_enabled;

  @field appearance_code;
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
  @field offering_id;
  @field is_lms_enabling_allowed = false;
  @field is_access_switchable = true;
  @field salesforce_book_name;

  @field starts_at;
  @field ends_at;

  @field term;
  @field time_zone;
  @field webview_url;
  @field year;

  @field homework_score_weight;
  @field homework_progress_weight;
  @field reading_score_weight;
  @field reading_progress_weight;

  @hasMany({ model: Period, inverseOf: 'course', extend: extendHasMany({
    sorted()   { return PH.sort(this.active);                        },
    archived() { return filter(this, period => !period.is_archived); },
    active()   { return filter(this, period => !period.is_archived); },
  }) }) periods;

  @hasMany({ model: Role }) roles;
  @hasMany({ model: Student, inverseOf: 'course' }) students;

  constructor(attrs, map) {
    super(attrs);
    this.map = map;
  }

  @computed get sortKey() {
    return this.primaryRole.joined_at;
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
  @lazyGetter referenceBook = new ReferenceBook({ id: this.ecosystem_id });
  @lazyGetter taskPlans = new TeacherTaskPlans({ course: this });

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

  @computed get shouldRemindNewEnrollmentLink() {
    return (!this.is_lms_enabled &&
            (this.isActive || this.isFuture) &&
            this.map.completed.any);
  }

  @computed get canAnnotate() {
    return Boolean(
      FeatureFlags.is_highlighting_allowed &&
        this.isStudent &&
        this.isActive &&
        'college_biology' == this.appearance_code
    );
  }

  @computed get needsPayment() {
    return Boolean(this.does_cost && this.userStudentRecord && this.userStudentRecord.needsPayment);
  }

  @computed get isInTrialPeriod() {
    return Boolean(this.does_cost && this.userStudentRecord && !this.userStudentRecord.isUnPaid);
  }

  @computed get defaultTimes() {
    return pick(this, 'default_due_time', 'default_open_time');
  }

  @computed get tourAudienceTags() {
    let tags = [];
    if (this.isTeacher) {
      tags.push(this.is_preview ? 'teacher-preview' : 'teacher');
      if (!this.is_preview) {
        if (this.notifyAboutRosterSplit) {
          tags.push('teacher-settings-roster-split');
        }
        if (this.taskPlans.reading.hasPublishing) {
          tags.push('teacher-reading-published');
        }
        if (this.taskPlans.homework.hasPublishing) {
          tags.push('teacher-homework-published');
        }
        if (this.shouldRemindNewEnrollmentLink) {
          tags.push('teacher-with-previous-courses');
        }
      }
    }
    if (this.isStudent) { tags.push('student'); }
    return tags;
  }

  // remove after 2018 spring semester
  @computed get notifyAboutRosterSplit() {
    return Boolean(
      !this.is_preview &&
      this.primaryRole.joinedAgo('days') <= 7 &&
      find(this.map.nonPreview.teaching.array,
           c => c != this && c.isBeforeTerm('winter', 2017))
    );
  }

  isBeforeTerm(term, year) {
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
    return { id: this.id, data: pick(this, SAVEABLE_ATTRS) };
  }
}
