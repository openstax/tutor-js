import {
  BaseModel, identifiedBy, field, hasMany, session,
} from 'shared/model';
import moment from 'moment';
import { find, startsWith, map, uniq, max } from 'lodash';
import { action, computed, observable } from 'mobx';
import UiSettings from 'shared/model/ui-settings';
import Courses from './courses-map';
import { UserTerms, Term } from './user/terms';
import ViewedTourStat from './user/viewed-tour-stat';
import { read_csrf } from '../helpers/dom';
import Flags from './feature_flags';
import Time from './time';

@identifiedBy('user')
class User extends BaseModel {

  @action.bound
  bootstrap(data) {
    this.update(data);
    this.csrf_token = read_csrf();
  }

  @observable csrf_token;
  terms = new UserTerms({ user: this });

  @field account_uuid;

  @field name;
  @field first_name;
  @field last_name;
  @field faculty_status;
  @field self_reported_role;
  @field account_uuid;
  @field profile_id;

  @field can_create_courses;
  @field profile_url;
  @field is_test;
  @field is_admin;
  @field is_content_analyst;
  @field is_customer_service;
  @hasMany({ model: Term  }) available_terms = [];

  @hasMany({ model: ViewedTourStat }) viewed_tour_stats;
  @session({ type: 'date' }) created_at;

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
    return !!find(Courses.nonPreview.active.array, { canAnnotate: true });
  }

  @computed get hasPreviewed() {
    return Courses.teaching.preview.any && Courses.teaching.preview.isViewed.any;
  }

  @computed get shouldPreview() {
    const exploreViewStats = this.viewed_tour_stats.find((stat) => stat.id === 'explore-a-preview');
    if (exploreViewStats) {
      return exploreViewStats.view_count < 4;
    }
    return true;
  }

  @action removeCourse(course) {
    return Courses.delete(course.id);
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
    return moment(Time.now).subtract(1, 'day').isBefore(this.created_at);
  }

  @computed get isProbablyTeacher() {
    return Boolean(this.can_create_courses || this.isConfirmedFaculty || this.self_reported_role === 'instructor' || Courses.teaching.any);
  }

  @computed get tourAudienceTags() {
    let tags = [];
    if (!Flags.tours){ return tags; }

    if (
      (Courses.active.isEmpty && this.canCreateCourses) ||
        Courses.active.teaching.nonPreview.any
    ) {
      tags.push('teacher');
    } else if (Courses.active.teaching.any) {
      tags.push('teacher-preview');
    }

    if (
      Courses.teaching.any &&
        this.hasPreviewed &&
        Courses.teaching.nonPreview.isEmpty
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
    this.viewed_tour_stats.clear();
  }

  replayTour(tour) {
    this.viewed_tour_stats.remove(find(this.viewed_tour_stats, { id: tour.id }));
  }

  viewedTour(tour, options) {
    let stats = this.viewed_tour_stats.find((stat) => stat.id === tour.countId);

    if (stats) {
      stats.view_count ++;
    } else {
      stats = new ViewedTourStat({ id: tour.countId });
      this.viewed_tour_stats.push(stats);
    }

    this.saveTourView({ id: tour.countId }, options);
  }

  verifiedRoleForCourse(course) {
    return this.isConfirmedFaculty && course.primaryRole ? course.primaryRole.type : 'student';
  }

  saveTourView(tour, options) {
    return { data: options };
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

  logEvent({ category, code, data }) {
    // students do not track events
    if (this.self_reported_role === 'student') { return 'ABORT'; }
    return { category, code, data };
  }

  @computed get metrics() {
    const courses = Courses.nonPreview.array;
    const getValues = (attr) => uniq(map(courses, attr)).join(';');
    return {
      role: this.isProbablyTeacher ? 'instructor' : 'student',
      is_new_user: Courses.completed.nonPreview.isEmpty,
      is_test_user: this.is_test,
      has_viewed_preview: Courses.preview.any,
      has_per_cost_course: Boolean(find(courses, 'does_cost')),
      course_subjects: getValues('appearance_code'),
      course_types: getValues(c => c.is_preview ? 'preview' : 'real'),
      course_roles: getValues('currentRole.type'),
      course_enrollment_types: getValues(c => c.is_lms_enabled ? 'lms' : 'links'),
      max_course_enrollment: max(courses.map(c => c.currentRole.isTeacher ? c.num_enrolled_students : -1)),
    };
  }
}

export { User };

const currentUser = new User;

export default currentUser;
