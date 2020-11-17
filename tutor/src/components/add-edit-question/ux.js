import { action, observable, computed } from 'vendor';
import { filter, some, find } from 'lodash';
import { TAG_BLOOMS, TAG_DOKS } from './form/tags/constants';

export default class AddEditQuestionUX {

  // local
  @observable showForm = false;

  // props
  @observable question;
  @observable book;
  // chapter/section ids
  @observable pageIds;

  /** form */
  // chapter/sections
  @observable selectedChapter;
  @observable selectedChapterSection;
  // tags
  @observable tagTime;
  @observable tagDifficulty;
  @observable tagBloom;
  @observable tagDok;
  // general
  @observable questionName;
  @observable allowOthersCopyEdit = false;
  @observable annonymize = false;

  constructor(props = {}) {
    this.book = props.book;
    // sections
    this.pageIds = props.pageIds;

    // auto selected if there is only one chapter or selected pre-selected
    if(this.preSelectedChapters.length === 1) {
      this.selectedChapter = this.preSelectedChapters[0];
      if(this.preSelectedChapterSections.length === 1) {
        this.selectedChapterSection = this.preSelectedChapterSections[0];
      }
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

  @action.bound changeTimeTag({ target: { value } }) {
    this.tagTime = value;
  }

  @action.bound changeDifficultyTag({ target: { value } }) {
    this.tagDifficulty = value;
  }

  @action.bound changeBloomTag(bloomValue) {
    this.tagBloom = find(TAG_BLOOMS, tg => tg.value === bloomValue);
  }

  @action.bound changeDokTag(dokValue) {
    this.tagDok = find(TAG_DOKS, td => td.value === dokValue);
  }

  @action.bound changeAllowOthersCopyEdit({ target: { checked } }) {
    this.allowOthersCopyEdit = checked;
  }

  @action.bound changeAnnonymize({ target: { checked } }) {
    this.annonymize = checked;
  }
}
