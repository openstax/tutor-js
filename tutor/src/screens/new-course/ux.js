import {
  BaseModel, identifiedBy,
} from 'shared/model';
import {
  invoke, filter, result, isEmpty, pick, values, every, delay, find,
} from 'lodash';
import { readonly } from 'core-decorators';
import { when, observable, computed, action, observe } from 'mobx';
import Course from '../../models/course';
import Courses from '../../models/courses-map';
import Offerings from '../../models/course/offerings';
import CreateCourse from '../../models/course/create';
import Router from '../../helpers/router';
import User from '../../models/user';

export default
@identifiedBy('course/builder-ux')
class CourseBuilderUX extends BaseModel {

  @readonly course = new Course();
  @observable canCancel = true;
  @observable source;

  @observable currentStageIndex;

  @readonly stages = [
    'offering', 'term', 'new_or_copy', 'cloned_from_id',
    'name', 'numbers', 'build',
  ]

  @readonly maximumSectionCount = 99;
  @observable course_type = 'tutor';
  @observable alternateOffering;
  @observable selectOfferingTitle = 'Which course are you teaching?';

  constructor({
    router,
    offerings = Offerings,
    courses = Courses,
  } = {}) {
    super();
    this.router = router;
    this.offerings = offerings;
    this.courses = courses;
    this.newCourse = new CreateCourse({ courses, offerings });
    if (!User.isAllowedInstructor) {
      delay(() => // use delay in case we're called from a React constructor
        router.history.replace(
          Router.makePathname('nonAllowedTeacher')
        )
      );
      this.currentStageIndex = 0;
      return;
    }

    invoke(this.offerings.fetch(), 'then', this.onOfferingsAvailable);

    observe(this, 'source', ({ newValue: newSource }) => {
      if (!newSource) { return; }
      when(
        () => this.offerings.get(newSource.offering_id),
        () => {
          this.newCourse.offering = this.offerings.get(newSource.offering_id);
          this.newCourse.cloned_from = newSource;
        },
      );
    }, true);

    observe(this, 'currentStageIndex', ({ newValue: index }) => {
      if (index === this.stages.length - 1 && !this.newCourse.api.isPending) {
        this.newCourse.save().then(this.afterCreate);
      }
    });
    const { sourceId } = this.params;
    if (sourceId) {
      this.source = this.courses.get(sourceId);
    }
    this.currentStageIndex = this.firstStageIndex;
  }

  @action.bound onKeyPress(ev) {
    if ('Enter' === ev.key && this.canGoForward) {
      this.goForward();
    }
  }


  @computed get params() {
    return this.router.match.params || {};
  }

  @action.bound onOfferingsAvailable() {
    if (this.preselectedAppearanceCode) {
      this.newCourse.offering = find(this.offerings.available.array,
        { appearance_code: this.preselectedAppearanceCode }
      );
    }
  }

  @computed get canNavigate() {
    return this.currentStageIndex !== this.stages.length - 1;
  }

  @computed get canGoForward() {
    return (this.isCurrentStageValid && this.currentStageIndex < this.stages.length - 1);
  }

  @computed get canGoBackward() {
    return (this.currentStageIndex > this.firstStageIndex);
  }

  @action.bound goForward() {
    this.currentStageIndex += 1;
    while (this.shouldSkip) {
      this.currentStageIndex += 1;
    }
  }

  @action.bound goBackward() {
    this._goBackward();
  }

  _goBackward() {
    this.currentStageIndex -= 1;
    while (this.shouldSkip) {
      this.currentStageIndex -= 1;
    }
  }

  @action.bound onCancel() {
    this.router.history.push('/dashboard');
  }

  @computed get stage() {
    if (!this.isBusy && this.offering && this.offering.is_available === false) {
      return 'offering_unavail';
    }

    return this.stages[this.currentStageIndex];
  }

  @computed get firstStageIndex() {
    return this.canSkipOffering ? 1 : 0;
  }

  @computed get isBusy() {
    return Boolean(this.newCourse.api.isPending || this.offerings.api.isPending);
  }

  @computed get isBuilding() {
    return this.stage === 'build';
  }

  @computed get offering() {
    if (this.preselectedAppearanceCode) {
      return find(this.offerings.available.array,
        { appearance_code: this.preselectedAppearanceCode }
      );
    }
    return this.newCourse.offering;
  }

  @computed get validOfferings() {
    return this.offerings.available.array;
  }

  @computed get preselectedAppearanceCode() {
    return this.params.appearanceCode;
  }

  @computed get canSkipOffering() {
    return Boolean(this.source || this.preselectedAppearanceCode);
  }

  @computed get cloneSources() {
    if (!this.offering) return [];
    return filter(this.courses.tutor.nonPreview.teaching.array, c => c.offering_id == this.offering.id);
  }

  @computed get isCurrentStageValid() {
    return !!result(this, `test_${this.stage}`, !!this.newCourse[this.stage]);
  }

  @computed get hasOfferingTitle() {
    return Boolean(this.currentStageIndex >= 1 && this.offering);
  }

  @computed get shouldSkip() {
    return !!(result(this, `skip_${this.stage}`, false) && this.currentStageIndex < this.stages.length - 1);
  }

  @action.bound
  afterCreate() {
    const c = this.newCourse.createdCourse;
    if (!c) { return; }
    const url = c.is_concept_coach ?
      `/course/${c.id}/cc/help?showIntro=true` : `/course/${c.id}?showIntro=true`;
    this.router.history.push(url);
  }

  // per step tests - must return true in order to navigate to next step
  test_course_type() {
    return !!this.course_type;
  }

  test_offering() {
    return !!this.offering;
  }

  test_cloned_from_id() {
    return !!this.newCourse.cloned_from;
  }

  test_name() {
    return every(values(pick(this.newCourse, 'name', 'timezone')), v => Boolean(v));
  }

  test_numbers() {
    return every(values(pick(this.newCourse, 'estimated_student_count', 'num_sections')), v => Boolean(v)) && !this.newCourse.error;
  }

  // skips
  skip_new_or_copy() {
    return Boolean(
      this.source || isEmpty(this.cloneSources)
    );
  }

  skip_cloned_from_id() {
    return Boolean(this.newCourse.new_or_copy === 'new');
  }

}
