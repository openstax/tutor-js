import {
  BaseModel, identifiedBy, field, identifier,
} from '../base';
import {
  uniqBy, keys, indexOf, filter, result, isEmpty, negate, pick, values, every,
} from 'lodash';
import { readonly } from 'core-decorators';
import { observable, computed, action, observe } from 'mobx';
import Course from '../course';
import Courses from '../courses-map';
import TutorRouter from '../../helpers/router';
import Offerings from './offerings';
import CreateCourse from './create';

@identifiedBy('course/builder-ux')
export default class CourseBuilderUX extends BaseModel {

  @readonly course = new Course();

  @observable source = Courses.get(TutorRouter.currentParams().sourceId);

  newCourse = new CreateCourse();

  @observable currentStageIndex;

  @readonly stages = [
    'course_type', 'offering', 'term', 'new_or_copy', 'cloned_from_id',
    'name', 'numbers', 'build',
  ]

  @readonly maximumSectionCount = 99;
  @observable course_type = '';

  constructor(router) {
    super();
    this.router = router;
    observe(this, 'source', ({ newValue: newSource }) => {
      if (newSource) {
        this.newCourse.offering_id = newSource.offering_id;
        this.newCourse.new_or_copy = 'copy';
      }
    }, true);

    observe(this, 'currentStageIndex', ({ newValue: index }) => {
      if (index === this.stages.length - 1 && !this.newCourse.hasApiRequestPending) {
        this.newCourse.save().then(this.afterCreate);
      }
    });

    observe(this, 'firstStageIndex', ({ newValue: index }) => {
      if (index > this.currentStageIndex) {
        this.currentStageIndex = index;
      }
    }, true);
    this.currentStageIndex = this.firstStageIndex;
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
    this.currentStageIndex -= 1;
    while (this.shouldSkip) {
      this.currentStageIndex -= 1;
    }
  }

  @action.bound onCancel() {
    this.router.transitionTo('/dashboard');
  }

  @computed get stage() {
    return this.stages[this.currentStageIndex];
  }

  @computed get firstStageIndex() {
    let stage;
    if (this.canSkipOffering) {
      stage = 2;
    } else {
      stage = this.canSelectCourseType ? 0 : 1;
    }
    return stage;
  }

  @computed get offering() {
    return this.newCourse.offering_id ? Offerings.get(this.newCourse.offering_id) : null;
  }

  @computed get validOfferings() {
    let offerings = Offerings.array;
    if (!this.allCoursesOfType && this.course_type) {
      offerings = filter(offerings, { is_concept_coach: this.courseTypeIsCC });
    }
    return offerings;
  }

  @computed get courseTypeIsCC() {
    return this.course_type === 'coach';
  }

  @computed get canSkipOffering() {
    return Boolean(this.source && this.offering);
  }

  @computed get canSelectCourseType() {
    return this.allCoursesOfType ? false : true;
  }

  @computed get allCoursesOfType() {
    const allCC = uniqBy(Courses.array, 'is_concept_coach');
    if (allCC.length !== 1) { return null; }
    return allCC[0].is_concept_coach ? 'cc' : 'tutor';
  }

  @computed get cloneSources() {
    return filter(Courses.nonPreview.array, c => c.isTeacher && c.offering_id == this.offering.id);
  }

  @computed get isCurrentStageValid() {
    return !!result(this, `test_${this.stage}`, !!this.newCourse[this.stage]);
  }

  @computed get hasOfferingTitle() {
    return Boolean(this.currentStageIndex > 1 && this.offering);
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
    this.router.transitionTo(url);
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
    return every(values(pick(this.newCourse, 'name', 'time_zone')), v => Boolean(v));
  }

  test_numbers() {
    return every(values(pick(this.newCourse, 'estimated_student_count', 'num_sections')), v => Boolean(v));
  }


  // skips
  skip_new_or_copy() {
    return !!this.source || Courses.isEmpty || Courses.nonPreview.isEmpty;
  }

  skip_cloned_from_id() {
    return this.newCourse.new_or_copy === 'new';
  }
}
