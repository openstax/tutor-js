import {
  BaseModel, belongsTo, identifiedBy, session, hasMany, field, identifier,
} from 'shared/model';
import {
  get, flatMap, groupBy, find, isEmpty, keys,
} from 'lodash';
import { computed } from 'mobx';
import { lazyInitialize } from 'core-decorators';
import ChapterSection from '../../chapter-section';
import Exercise from '../../exercises/exercise';
import { ReviewQuestion } from 'shared/model/exercise/question';

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


const AnswersAssociation = {
  withFreeResponse() {
    return this.filter(ans => !isEmpty(ans.free_response));
  },
};

@identifiedBy('task-plan/stats/question')
class QuestionStats extends BaseModel {

  @session question_id;
  @session answered_count;

  @session exercise;

  @hasMany({ model: Answer, inverseOf: 'question', extend: AnswersAssociation }) answers;
  @hasMany({ model: AnswerStat, inverseOf: 'question' }) answer_stats;

  @lazyInitialize forReview = new ReviewQuestion(this);

  @computed get hasFreeResponse() {
    return find(this.answers, a => !isEmpty(a.free_response));
  }

  @computed get content() {
    return find(this.exercise.content.questions, q =>
      q.id == this.question_id
    ) || {};
  }
}

@identifiedBy('task-plan/stats/page')
class Page extends BaseModel {

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
class Stats extends BaseModel {

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
      return flatMap(this[pageType], pg => pg.exercises);
    });
  }

  @computed get exercisesBySection() {
    return groupBy(this.exercises, ex => ex.page.chapter_section.asString);
  }

  @computed get sections() {
    return keys(this.exercisesBySection);
  }
}

export default
@identifiedBy('task-plan/stats')
class TaskPlanStats extends BaseModel {

  @identifier id;
  @session title;
  @session type;

  @session shareable_url;

  @hasMany({ model: Stats, inverseOf: 'plan' }) stats;

  @belongsTo({ model: 'task-plans/teacher/plan' }) taskPlan;

  fetch() { return { id: this.taskPlan.id }; }
  fetchReview() { return { id: this.taskPlan.id }; }

}

export { QuestionStats, Page, Stats };
