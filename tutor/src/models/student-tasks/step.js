import {
  BaseModel, identifiedBy, field, identifier,
  observable, computed, action, belongsTo, hasMany,
} from 'shared/model';
import S from '../../helpers/string';
import { pick, get } from 'lodash';
import Exercise from '../exercises/exercise';
import ChapterSection from '../chapter-section';
import RelatedContent from '../related-content';
import ReferenceBookNode from '../reference-book/node';
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
class StudentTaskPlaceHolderStep extends TaskStepContent { }

class StudentTaskReadingStep extends TaskStepContent {
  @observable title;
  @lazyGetter chapterSection = new ChapterSection(this.chapter_section);
  @hasMany({ model: RelatedContent }) related_content;
  @lazyGetter page = new ReferenceBookNode({
    uuid: this.related_content[0].uuid,
    id: this.related_content[0].page_id,
    cnx_id: extractCnxId(this.content_url),
    content_html: this.html,
    title: this.related_content[0].title,
    chapter_section: this.chapterSection,
  });
  @computed get pageTitle() {
    return this.title || get(this, 'related_content[0].title');
  }
}

export
class StudentTaskExerciseStep extends Exercise {
  @field context;
  get stem_html() { return this.content.stem_html; }
  get questions() { return this.content.questions; }
  get stimulus_html() { return this.content.stimulus_html; }
}

const ContentClasses = {
  video: StudentTaskVideoStep,
  reading: StudentTaskReadingStep,
  exercise: StudentTaskExerciseStep,
  external_url: StudentTaskExternalStep,
  placeholder: StudentTaskPlaceHolderStep,
  interactive: StudentTaskInteractiveStep,
};

const UNSAVEABLE_TYPES = [
  'placeholder',
];

const NO_ADDITIONAL_CONTENT = [
  'external_url',
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
  @field({ type: 'object' }) spy;
  @field external_url;
  @field({ type: 'array' }) labels;
  @field({ type: 'array' }) formats;
  @field group;

  @belongsTo({ model: 'student-tasks/step-group' }) multiPartGroup;

  @field({ type: 'object' }) task;
  @observable content;

  @computed get canAnnotate() {
    return this.isReading;
  }

  @computed get chapterSection() {
    return this.content.related_content ?
      this.content.related_content[0].chapter_section : null;
  }

  @computed get isExercise() {
    return 'exercise' === this.type;
  }
  @computed get isReading() {
    return 'reading' === this.type;
  }
  @computed get isExternalUrl() {
    return 'external_url' === this.type;
  }
  @computed get isInteractive() {
    return 'interactive' === this.type;
  }
  @computed get isVideo() {
    return 'video' === this.type;
  }
  @computed get isPlaceHolder() {
    return 'placeholder' === this.type;
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
    return 'spaced practice' == this.group ;
  }

  @computed get needsFreeResponse() {
    return Boolean(
      !this.answer_id && this.isTwoStep && S.isEmpty(this.free_response)
    );
  }

  @computed get hasBeenAnswered() {
    return Boolean(this.answer_id);
  }

  @computed get canAnswer() {
    return Boolean(
      this.isExercise && (!this.hasBeenAnswered || !this.task.isFeedbackAvailable)
    );
  }

  @computed get needsFetched() {
    return Boolean(
      !NO_ADDITIONAL_CONTENT.includes(this.type) && !this.api.hasBeenFetched
    );
  }

  @action fetchIfNeeded() {
    if (this.needsFetched && !this.api.isFetchInProgress) {
      this.fetch();
    }
  }

  @action markViewed() {
    if (!this.isExercise && !this.isExternalUrl && !this.is_completed) {
      this.is_completed = true;
      this.save();
    }
  }

  // called when the task is reloaded and each step is reset
  @action setFromTaskFetch(data) {
    // the step is being re-used and it's type changed
    if (data.id != this.id || data.type != this.type) {
      this.content = null;
      this.isFetched = false;
    }
    this.api.reset();
    this.update(data);
  }

  // called by API
  fetch() { }
  save() {
    if (UNSAVEABLE_TYPES.includes(this.type)) { return 'ABORT'; }
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
