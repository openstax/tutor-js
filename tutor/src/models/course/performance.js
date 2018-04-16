import {
  BaseModel, identifiedBy, field, hasMany, computed, belongsTo, identifier,
} from 'shared/model';
import { observable, action } from 'mobx';
import {
  concat, map, flatten, uniq, compact, sortBy, takeRight, take, partial,
  identity, mapKeys, extend, forEach, flow, includes, isEmpty, isString,
} from 'lodash';

import Map from 'shared/model/map';

const recurseThroughChildren = (mapChild, performance) => {
  if (performance.children) {
    return compact(concat(
      map(performance.children, mapChild),
      flatten(map(performance.children, partial(recurseThroughChildren, mapChild))),
    ));
  }
}

@identifiedBy('course/performance/clue')
class CoursePerformanceClue extends BaseModel {
  @field({ type: 'number'}) minimum;
  @field({ type: 'number'}) most_likely;
  @field({ type: 'number'}) maximum;
  @field({ type: 'boolean'}) is_real;
  @field({ type: 'string'}) ecosystem_uuid;

  @belongsTo({ model: 'course/performance/section' }) section;
}

@identifiedBy('course/performance/section')
class CoursePerformanceSection extends BaseModel {
  @field({ type: 'string'}) title;
  @field({ type: 'array'}) chapter_section;
  @field({ type: 'number'}) student_count;
  @field({ type: 'number'}) questions_answered_count;
  @field({ model: 'clue'}) clue;
  @field({ type: 'array'}) page_ids;

  @hasMany({ model: 'course/performance/section', inverseOf: 'section' }) children;

  @computed get type() {
    return this.chapter_section.length === 1 ? 'chapter' : 'section';
  }

  @computed get isChapter() {
    return this.type === 'chapter';
  }

  @computed get isSection() {
    return this.type === 'section';
  }

  @computed get canDisplayForecast() {
    return this.clue.is_real;
  }

  @computed get label() {
    if (this.isChapter) {
      return `${this.chapter_section}-0`;
    } else if (this.isSection) {
      return this.chapter_section.join('-');
    } else {
      return '';
    }
  }

  constructor(attrs) {
    super(attrs);
    this.id = this.label;
  }
}

class CoursePerformancesMap extends Map {

  displayCount = 4;

  @computed get sections() {
    return this.where(p => p.isSection);
  }

  @computed get chapters() {
    return this.where(p => p.isChapter);
  }

  @computed get forecasted() {
    return this.where(p => p.canDisplayForecast);
  }

  @computed get recent() {
    const recentKeys = takeRight(this.keys(), this.displayCount);
    return this.where(p => includes(recentKeys, p.id));
  }

  @computed get pages() {
    return flow(
      partial(map, partial.placeholder, ( p => p.page_ids.toJS() )),
      flatten,
      uniq,
    )(this.array);
  }

  @computed get sortByWeakness() {
    return sortBy(this.array, 'clue.most_likely');
  }

  @computed get practiceSize() {
    if (this.forecasted.size < 2) {
      return 0;
    }

    return Math.min(
      Math.max(1, Math.floor(this.forecasted.size / 2))
    , this.displayCount);
  }

  @computed get weakest() {
    return take(this.sortByWeakness, this.practiceSize);
  }

  @computed get canPracticeWeakest() {
    return !isEmpty(this.weakest);
  }

  @computed get canDisplayWeakest() {
    return this.forecasted.any;
  }
}

@identifiedBy('course/performance')
class CoursePerformance extends BaseModel {
  @field({ type: 'string'}) period_id;
  @field({ type: 'string'}) title;
  @field({ type: 'array'}) page_ids;

  @hasMany({
    model: 'course/performance/section',
    inverseOf: 'performance',
  }) children;

  constructor(attrs, course) {
    super(attrs);
    this.course = course;

    this.performances = new CoursePerformancesMap();

    forEach(recurseThroughChildren(identity, this), (performance) => {
      this.performances.set(performance.id, performance);
    });
  }
}

@identifiedBy('course/performance/teacher-student')
export class CoursePerformanceTeacherStudent extends BaseModel {

  @belongsTo({ model: 'course' }) course;
  @observable students = observable.map();

  fetch(roleId) {
    return {
      url: `courses/${this.course.id}/guide/role/${roleId}`,
      roleId,
    };
  }

  @action onLoaded({ data }, fetchArguments, { roleId }) {
    this.students.set(roleId, new CoursePerformance(data, this.course));
  }
}

@identifiedBy('course/performance/teacher')
export class CoursePerformanceTeacher extends BaseModel {

  @belongsTo({ model: 'course' }) course;
  @observable periods = observable.map();

  fetch(roleId) {
    return { url: `courses/${this.course.id}/teacher_guide` };
  }

  @action onLoaded({ data }) {
    data.forEach(s => this.periods.set(s.period_id, new CoursePerformance(s, this.course)));
  }
}

@identifiedBy('course/performance/student')
export class CoursePerformanceStudent extends BaseModel {

  @belongsTo({ model: 'course' }) course;
  @observable guide;

  fetch() {
    return { url: `courses/${this.course.id}/guide` };
  }

  @action onLoaded({ data }) {
    this.guide = new CoursePerformance(data, this.course);
  }
}
