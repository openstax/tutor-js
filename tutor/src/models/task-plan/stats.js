import {
  BaseModel, belongsTo, identifiedBy, session, hasMany, field, identifier,
} from '../base';
import {
  get, flatMap, groupBy, find, isNil, isObject, isEmpty, keys,
} from 'lodash';
import { computed } from 'mobx';
import { lazyInitialize } from 'core-decorators';
import ChapterSection from '../chapter-section';

@identifiedBy('task-plan/stats/answer-stat')
class AnswerStat extends BaseModel {

  @session answer_id;
  @session selected_count;

  @belongsTo({ model: 'task-plan/stats/question' }) question;

  @computed get content() {
    return find(get(this.question.content, 'answers'), a => a.id == this.answer_id) || {};
  }

  @computed get id() { return this.answer_id; }

  @computed get correctness() {
    return this.content.correctness;
  }
  @computed get content_html() {
    return this.content.content_html;
  }
}

@identifiedBy('task-plan/stats/answer')
class Answer extends BaseModel {

  @session({ type: 'array' }) student_names;
  @session free_response;
  @session answer_id;

  @belongsTo({ model: 'task-plan/stats/question' }) question;
  @computed get selected_count() {
    return find(this.question.answer_stats, anst => anst.answer_id == this.answer_id).selected_count || 0;
  }

}


class ReviewQuestion {

  constructor(question) {
    this.q = question;
  }
  get id() { return this.q.question_id; }
  @computed get answers() { return this.q.answer_stats; }
  @computed get formats() { return this.q.content.formats; }
  @computed get stem_html(){ return this.q.content.stem_html; }
  @computed get stimulus_html() { return this.q.content.stimulus_html; }
}


@identifiedBy('task-plan/stats/question')
export class Question extends BaseModel {

  @session question_id;
  @session answered_count;

  @belongsTo({ model: 'task-plan/stats/exercise' }) exercise;
  @hasMany({ model: Answer, inverseOf: 'question' }) answers;
  @hasMany({ model: AnswerStat, inverseOf: 'question' }) answer_stats;
  @lazyInitialize forReview = new ReviewQuestion(this);

  @computed get hasFreeResponse() {
    return find(this.answers, a => !isEmpty(a.free_response));
  }

  @computed get content() {
    return find(this.exercise.contentData.questions, q =>
      q.id == this.question_id
    ) || {};
  }
}


@identifiedBy('task-plan/stats/exercise')
export class Exercise extends BaseModel {

  @session content;

  @session average_step_number;
  @belongsTo({ model: 'task-plan/stats/page' }) page;
  @hasMany({ model: Question, inverseOf: 'exercise' }) question_stats;

  @computed get contentData() {
    return (isNil(this.content) || isObject(this.content)) ? this.content : JSON.parse(this.content) || {};
  }

  @computed get uid() {
    return this.contentData ? this.contentData.uid : '';
  }
}


@identifiedBy('task-plan/stats/page')
export class Page extends BaseModel {

  @identifier id;
  @field({ model: ChapterSection }) chapter_section
  @session title;
  @session correct_count;
  @session incorrect_count;
  @session is_trouble;
  @session student_count;

  @hasMany({ model: Exercise, inverseOf: 'page' }) exercises;
}

@identifiedBy('task-plan/stats/stat')
export class Stats extends BaseModel {

  @session period_id;
  @session name;
  @session total_count;
  @session complete_count;
  @session partially_complete_count;
  @belongsTo({ model: 'task-plan/stats' }) taskPlan;
  @session is_trouble;
  @hasMany({ model: Page }) current_pages;
  @hasMany({ model: Page }) spaced_pages;

  @computed get exercises() {
    return flatMap(['current_pages', 'spaced_pages'], pageType => {
      return flatMap(this[pageType], pg => pg.exercises.peek());
    });
  }

  @computed get exercisesBySection() {
    return groupBy(this.exercises, ex => ex.page.chapter_section.asString);
  }

  @computed get sections() {
    return keys(this.exercisesBySection);
  }
}

@identifiedBy('task-plan/stats')
export default class TaskPlanStats extends BaseModel {

  @identifier id;
  @session title;
  @session type;

  @session shareable_url;

  @hasMany({ model: Stats, inverseOf: 'plan' }) stats;

  @belongsTo({ model: 'task-plan/teacher' }) taskPlan;

  fetch() { return { id: this.taskPlan.id }; }
  fetchReview() { return { id: this.taskPlan.id }; }

}
