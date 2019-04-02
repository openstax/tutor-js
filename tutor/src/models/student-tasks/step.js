import {
  BaseModel, identifiedBy, field, identifier,
  observable, computed, action, belongsTo, hasMany,
} from 'shared/model';
import { pick, isEmpty } from 'lodash';
import Exercise from '../exercises/exercise';
import ChapterSection from '../chapter-section';
import RelatedContent from '../related-content';
import Page from '../reference-book/page';
import lazyGetter from 'shared/helpers/lazy-getter';
import { extractCnxId } from '../../helpers/content';

class TaskStepContent extends BaseModel {
  update(data) {
    Object.assign(this, data);
  }
}

class StudentTaskVideoStep extends TaskStepContent { }
class StudentTaskExternalStep extends TaskStepContent { }
class StudentTaskInteractiveStep extends TaskStepContent { }

class StudentTaskReadingStep extends TaskStepContent {
  @lazyGetter chapterSection = new ChapterSection(this.chapter_section);
  @hasMany({ model: RelatedContent }) related_content;
  @lazyGetter page = new Page(
    Object.assign({
      cnx_id: extractCnxId(this.content_url),
      content_html: this.html,
      title: this.related_content[0].title,
      chapter_section: this.chapterSection,
    }),
  );
}

export
class StudentTaskExerciseStep extends Exercise {
  get questions() {
    return this.content.questions;
  }
}

const ContentClasses = {
  video: StudentTaskVideoStep,
  reading: StudentTaskReadingStep,
  exercise: StudentTaskExerciseStep,
  external_url: StudentTaskExternalStep,
  interactive: StudentTaskInteractiveStep,
};


const HAS_ADDITIONAL_CONTENT = [
  'reading', 'exercise', 'interactive', 'video',
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
  @field({ type: 'object' }) response_validation;

  @field external_url;

  @field({ type: 'array' }) labels;
  @field({ type: 'array' }) formats;

  @belongsTo({ model: 'student-tasks/step-group' }) multiPartGroup;

  @observable task;
  @observable content;

  @computed get canAnnotate() {
    return this.isReading;
  }

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
      !this.answer_id && this.isTwoStep && isEmpty(this.free_response)
    );
  }

  @computed get needsFetched() {
    return Boolean(
      HAS_ADDITIONAL_CONTENT.includes(this.type) && !this.api.hasBeenFetched
    );
  }

  @action fetchIfNeeded() {
    if (this.needsFetched && !this.api.isPending) { this.fetch(); }
  }

  @action markViewed() {
    if (!this.isExercise && !this.is_completed) {
      this.is_completed = true;
      this.save();
    }
  }

  // called by API
  fetch() { }
  save() {
    return { data: pick(this,
      'is_completed', 'answer_id', 'free_response', 'response_validation',
    ) };
  }

  @action beginRecordingAnswer({ free_response }) {
    this.free_response = free_response;
    this.answer_id = null;
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
