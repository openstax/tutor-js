import { action, observable, computed } from 'vendor';
import { filter, some } from 'lodash';

export default class AddEditQuestionUX {

  // props
  @observable question;
  @observable book;
  // chapter/section ids
  @observable pageIds;

  // local
  @observable showForm = false;
  @observable selectedChapterUUID;

  constructor(props = {}) {
    this.book = props.book;
    this.pageIds = props.pageIds;
    this.chapterSections = props.chapterSections;
  }

  @action.bound setShowForm(show) {
    this.showForm = show;
  }

  @computed get preSelectedChapters() {
    // return the chapters by checking the section pageIds
    return filter(this.book.chapters, bc => 
      some(bc.children, c => 
        some(this.pageIds, pi => pi === c.id)));
  }

  @computed get preSelectedChapterSections() {

  }
}