import { action, observable, computed } from 'vendor';
import { filter, some, find, forEach } from 'lodash';
import { TAG_BLOOMS, TAG_DOKS } from './form/tags/constants';

export default class AddEditQuestionUX {

  // local
  @observable showForm = false;

  // props
  //@observable question;
  @observable book;
  @observable courseId;
  // chapter/section ids
  @observable pageIds;

  /** form */
  // chapter/sections
  @observable selectedChapter;
  @observable selectedChapterSection;
  // question
  @observable questionText;
  @observable answerKeyText;
  @observable isTwoStep;
  @observable options = [];
  @observable detailedSolution;
  // tags
  @observable tagTime;
  @observable tagDifficulty;
  @observable tagBloom;
  @observable tagDok;
  // general
  @observable questionName;
  @observable allowOthersCopyEdit = true;
  @observable annonymize = false;

  constructor(props = {}) {
    this.book = props.book;
    this.courseId = props.courseId;
    // sections
    this.pageIds = props.pageIds;

    // auto selected if there is only one chapter or selected pre-selected
    if(this.preSelectedChapters.length === 1) {
      this.selectedChapter = this.preSelectedChapters[0];
      if(this.preSelectedChapterSections.length === 1) {
        this.selectedChapterSection = this.preSelectedChapterSections[0];
      }
    }

    // show 4 options by default
    for(let i = 0; i < 4; i++) {
      this.options.push({
        text: '', feedback: '', isCorrect: false,
      });
    }
  }

  @action.bound setShowForm(show) {
    this.showForm = show;
  }

  // Chapters that the user has selected
  @computed get preSelectedChapters() {
    // return the chapters by checking the section pageIds
    return filter(this.book.chapters, bc => 
      some(bc.children, c => 
        some(this.pageIds, pi => pi === c.id)));
  }

  // Sections that the user has selected
  @computed get preSelectedChapterSections() {
    if (!this.selectedChapter) {
      return null;
    }
    return filter(this.selectedChapter.children, scc => 
      some(this.pageIds, pi => pi === scc.id) && scc.isAssignable);
  }

  // Get the browe book link with the chapter or section selected
  @computed get browseBookLink() {
    let browseBookLink = `/book/${this.courseId}`;
    if (this.selectedChapterSection) {
      browseBookLink += `/page/${this.selectedChapterSection.id}`;
    }
    else if (this.selectedChapter &&
      this.selectedChapter.children &&
      this.selectedChapter.children.length > 0) {
      browseBookLink += `/page/${this.selectedChapter.children[0].id}`;
    }
    return browseBookLink;
  }

  // actions for topic form section
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

  // actions for question form section
  @action.bound changeQuestionText({ target: { value } }) {
    this.questionText = value;
  }

  @action.bound changeAnwserKeyText({ target: { value } }) {
    this.answerKeyText = value;
  }

  @action.bound changeIsTwoStep({ target: { checked } }) {
    this.isTwoStep = checked;
  }

  @action changeOptions(answer, index) {
    this.options[index].text = answer;
  }

  @action changeFeedback(feedback, index) {
    this.options[index].feedback = feedback;
  }

  @action checkCorrectOption(index) {
    forEach(this.options, (o, optionIndex) => {
      if(optionIndex === index) {
        o.isCorrect = true;
      } else {
        o.isCorrect = false;
      }
    });
  }

  @action.bound addOption() {
    // up to 6 options only
    if(this.options.length === 6) return;
    this.options.push({
      text: '', feedback: '', isCorrect: false,
    });
  }

  @action deleteOption(index) {
    this.options.splice(index, 1);
  }

  @action moveUpOption(index) {
    let tempOption = this.options[index];
    this.options[index] = this.options[index - 1];
    this.options[index - 1] = tempOption;
  }

  @action moveDownOption(index) {
    let tempOption = this.options[index];
    this.options[index] = this.options[index + 1];
    this.options[index + 1] = tempOption;
  }

  @action.bound changeDetailedSolution({ target: { value } }) {
    this.detailedSolution = value;
  }

  // actions for tags form section
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

  // actions for general form section
  @action.bound changeQuestionName({ target: { value } }) {
    this.questionName = value;
  }

  @action.bound changeAllowOthersCopyEdit({ target: { checked } }) {
    this.allowOthersCopyEdit = checked;
  }

  @action.bound changeAnnonymize({ target: { checked } }) {
    this.annonymize = checked;
  }
}
