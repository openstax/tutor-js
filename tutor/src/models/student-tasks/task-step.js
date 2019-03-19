import {
  BaseModel, identifiedBy, field, identifier,
  observable, computed, action,
} from 'shared/model';
import Exercise from '../exercises/exercise';
//import SharedExercise from 'shared/model/exercise';
import ChapterSection from '../chapter-section';
import RelatedContent from '../related-content';
import Page from '../reference-book/page';
import lazyGetter from 'shared/helpers/lazy-getter';

class ExerciseQuestions extends BaseModel {


}

class TaskStepContent extends BaseModel {
  update(data) {
    Object.assign(this, data);
  }
}

class StudentContentBasedStep extends TaskStepContent {
  @lazyGetter chapterSection = new ChapterSection(this.chapter_section);
  @lazyGetter relatedContent = this.related_content.map(rl=>new RelatedContent(rl));
  @lazyGetter page = new Page(this.related_content[0]);
}

class StudentTaskReadingStep extends StudentContentBasedStep {

}


export
class StudentTaskExerciseStep extends Exercise {

  // @hasMany({ model: ExerciseQuestions }) questions;
  //
  // constructor(data) {
  //   Object.assign(data, { questions: data.content.questions })
  //   delete data.content.questions
  //   super(data)
  // }
  //
  // @computed get isMultiPart() {
  //   return this.questions.length > 1;
  // }
}

const ContentClasses = {
  reading: StudentTaskReadingStep,
  exercise: StudentTaskExerciseStep,
};


export default
@identifiedBy('student-tasks/task-step')
class StudentTaskStep extends BaseModel {

  @observable content;

  @identifier id;

  @field preview;
  @field type;
  @field is_completed;

  @observable isFetched = false

  @computed get needsFetched() {
    return !this.isFetched;
  }

  @computed get canOnlyContinue() {
    return true
  }

  // called by API
  fetch() { }

  @action onLoaded({ data }) {
    const Klass = ContentClasses[this.type];
    if (!Klass) {
      throw new Error(`Attempted to set content on unknown step type ${this.type}`);
    }
    this.content = new Klass(data);
    this.isFetched = true;
  }
};
