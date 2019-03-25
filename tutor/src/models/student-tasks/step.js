import {
  BaseModel, identifiedBy, field, identifier,
  observable, computed, action, belongsTo,
} from 'shared/model';
import { last, pick, includes, isEmpty } from 'lodash';
import Exercise from '../exercises/exercise';
//import SharedExercise from 'shared/model/exercise';
import ChapterSection from '../chapter-section';
import RelatedContent from '../related-content';
import Page from '../reference-book/page';
import lazyGetter from 'shared/helpers/lazy-getter';

class TaskStepContent extends BaseModel {
  update(data) {
    Object.assign(this, data);
  }
}

class StudentTaskInteractiveStep  extends TaskStepContent {

}

class StudentTaskReadingStep extends TaskStepContent {
  @lazyGetter chapterSection = new ChapterSection(this.chapter_section);
  @lazyGetter relatedContent = this.related_content.map(rl=>new RelatedContent(rl));
  @lazyGetter page = new Page(
    Object.assign({
      cnx_id: last(this.content_url.split(':')),
      content_html: this.content,
      title: this.related_content[0].title,
      chapter_section: this.related_content[0].book_location,
    }),
  );

}


export
class StudentTaskExerciseStep extends Exercise {

  get exercise() {
    return this.content;
  }

  get questions() {
    return this.exercise.questions;
  }
}

const ContentClasses = {
  reading: StudentTaskReadingStep,
  exercise: StudentTaskExerciseStep,
  interactive: StudentTaskInteractiveStep,
};


const HAS_ADDITIONAL_CONTENT = [
  'reading', 'exercise', 'interactive',
];

export default
@identifiedBy('student-tasks/task-step')
class StudentTaskStep extends BaseModel {

  @identifier id;
  @field uid;
  @field preview;
  @field type;
  @field is_completed;
  @field answer_id;
  @field free_response;
  @field feedback_html;
  @field correct_answer_id;


  @field({ type: 'array' }) labels;
  @field({ type: 'array' }) formats;

  @belongsTo({ model: 'student-tasks/step-group' }) multiPartGroup;

  @observable task;
  @observable content;

  @observable isFetched = false

  // @computed get needsSaved() {
  //   !this.is_completed || this.answer_id != this.pending_answer_id;
  // }

  @computed get isExercise() {
    return 'exercise' === this.type;
  }
  @computed get isReading() {
    return 'reading' === this.type;
  }

  @computed get isCorrect() {
    return Boolean(
      this.correct_answer_id && this.answer_id == this.correct_answer_id
    );
  }

  @computed get isTwoStep() {
    return Boolean(
      this.isExercise && this.formats.includes('free-response'),
    );
  }

  @computed get isReview() {
    return this.labels.includes('review');
  }

  @computed get isPersonalized() {
    return 'personalized' == this.group ;
  }

  @computed get isSpacedPractice() {
    return 'spaced-practice' == this.group ;
  }

  @computed get needsFreeResponse() {
    return Boolean(
      this.isTwoStep && isEmpty(this.free_response)
    );
  }

  @computed get needsFetched() {
    return (this.isReading || this.isExercise) &&
      !this.api.hasBeenFetched;
  }

  @action fetchIfNeeded() {
    if (HAS_ADDITIONAL_CONTENT.includes(this.type) &&
      !this.api.isPendingInitialFetch &&
      !this.isFetched
    ) {
      this.fetch();
    }
  }

  // @action setAnswer(answer) {
  //   this.answer_id = answer.id;
  // }

  // called by API
  saveAnswer() {
    return { data: pick(this, 'answer_id', 'free_response') };
  }

  fetch() {
  }

  @action onAnswerSaved({ data }) {
    this.onLoaded({ data });
  }

  @action onLoaded({ data }) {
    this.update(data);
    const Klass = ContentClasses[this.type];
    if (!Klass) {
      throw new Error(`Attempted to set content on unknown step type ${this.type}`);
    }
    this.content = new Klass(data);
    this.isFetched = true;
  }

}
