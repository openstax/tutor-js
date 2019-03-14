import {
  BaseModel, identifiedBy, field, identifier, observable, computed, action,
} from 'shared/model';
import ChapterSection from '../chapter-section';
import Page from '../reference-book/page';
import lazyGetter from 'shared/helpers/lazy-getter';


class TaskStepContent {
  constructor(data) {
    Object.assign(this, data);
  }
}

class StudentTaskReadingStep extends TaskStepContent {

  @lazyGetter chapterSection = new ChapterSection(this.chapter_section);
  @lazyGetter page = new Page(this.related_content[0]);

}

const ContentClasses = {
  reading: StudentTaskReadingStep,
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
