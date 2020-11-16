import { action, observable, computed } from 'vendor';
import { filter, some, find } from 'lodash';

export default class AddEditQuestionUX {

  // local
  @observable showForm = false;

  // props
  @observable question;
  @observable book;
  // chapter/section ids
  @observable pageIds;

  //form
  @observable selectedChapter;
  @observable selectedChapterSection;

  constructor(props = {}) {
    this.book = props.book;
    // sections
    this.pageIds = props.pageIds;

    if(this.preSelectedChapters.length === 1) {
      this.selectedChapter = this.preSelectedChapters[0];
    }
  }

  @action.bound setShowForm(show) {
    this.showForm = show;
  }

  /**
   * Chapters that the user has selected
   */
  @computed get preSelectedChapters() {
    // return the chapters by checking the section pageIds
    return filter(this.book.chapters, bc => 
      some(bc.children, c => 
        some(this.pageIds, pi => pi === c.id)));
  }

  /**
   * Sections that the user has selected
   */
  @computed get preSelectedChapterSections() {
    if (!this.selectedChapter) {
      return null;
    }
    return filter(this.selectedChapter.children, scc => 
      some(this.pageIds, pi => pi === scc.id) && scc.isAssignable);
  }

  @action.bound setSelectedChapterByUUID(uuid) {
    this.selectedChapter = find(this.preSelectedChapters, psc => psc.uuid === uuid);
    if(this.preSelectedChapterSections.length === 1) {
      this.selectedChapterSection = this.preSelectedChapterSections[0];
    }
    else {
      this.selectedChapterSection = null;
    }
  }

  @action.bound setSelectedChapterSectionByUUID(uuid) {
    this.selectedChapterSection = find(this.preSelectedChapterSections, pscs => pscs.uuid === uuid);
  }
}
