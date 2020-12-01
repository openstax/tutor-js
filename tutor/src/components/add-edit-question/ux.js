import { action, observable, computed } from 'vendor';
import { filter, some, find, forEach, pickBy, every, map } from 'lodash';
import { TAG_BLOOMS, TAG_DOKS } from './form/tags/constants';
import User from '../../models/user';
import S from '../../helpers/string';

export default class AddEditQuestionUX {

  // local
  @observable didUserAgreeTermsOfUse;
  @observable isMCQ;
  // other users or OpenStax
  @observable isUserGeneratedQuestion = false;

  // track emptiness of required fields
  @observable isEmpty = {
    selectedChapter: false,
    selectedChapterSection: false,
    questionText: false,
    correctOption: false,
  }

  //modal
  @observable feedbackTipModal = {
    show: false,
    shouldExitOnPublish: false,
  }

  /** props */
  @observable book;
  @observable course;
  @observable exercise;
  // chapter/section ids
  @observable pageIds;
  // Parent of the AddEditQuestion controls the display of the modal
  onDisplayModal;

  /** form */
  @observable from_exercise_id = null;
  // chapter/sections
  @observable selectedChapter;
  @observable selectedChapterSection;
  // question
  @observable questionText;
  @observable isTwoStep = false;
  @observable options = [];
  // detailed solution (MCQ). answer key (WRQ)
  @observable detailedSolution;
  // tags
  @observable tagTime;
  @observable tagDifficulty;
  @observable tagBloom;
  @observable tagDok;
  // general
  @observable questionName;
  @observable author;
  @observable allowOthersCopyEdit = true;
  @observable annonymize = false;
  @observable excludeOriginal = false;

  // for creating the exercise
  exercises;

  constructor(props = {}) {
    this.book = props.book;
    this.course = props.course;
    // props
    this.pageIds = props.pageIds;
    this.exercise = props.exercise;
    this.onDisplayModal = props.onDisplayModal;
    this.exercises = props.exercises;

    //TODO: get from BE
    this.didUserAgreeTermsOfUse = true;

    // edit or create
    if(props.exercise) {
      this.exercise = props.exercise;
      this.isUserGeneratedQuestion = props.exercise.belongsToCurrentUserProfileId(User.profile_id);
      this.populateExerciseContent(props.exercise);
    }
    else {
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
      this.isMCQ = true;
    }
    // get author
    this.author = this.authors[0];
  }

  populateExerciseContent(exercise) {
    // question - can only edit questions that are not MPQ
    const question = exercise.content.questions[0];
    this.from_exercise_id = exercise.id;
    this.isMCQ = question.isMultipleChoice;
    // chapter & section
    this.selectedChapter = find(this.preSelectedChapters, psc => some(psc.children, c => c.uuid === exercise.page_uuid));
    this.selectedChapterSection = find(this.preSelectedChapterSections, pscs => pscs.uuid === exercise.page_uuid);
    
    this.questionText = question.stem_html;
    this.isTwoStep = question.isTwoStep;
    forEach(question.answers, a => {
      this.options.push({
        text: a.content_html,
        feedback: a.feedback_html,
        isCorrect: a.isCorrect,
      });
    });
    const detailedSolution = find(question.collaborator_solutions, cs => cs.solution_type === 'detailed');
    this.detailedSolution = detailedSolution ? detailedSolution.content_html : '';
    
    // tags
    if(exercise.tags && exercise.tags.length > 0) {
      const exerciseTags = exercise.tags;
      const time = find(exerciseTags, t => t.type === 'time');
      const difficulty = find(exerciseTags, t => t.type === 'difficulty');
      this.tagTime = time ? time.value : undefined;
      this.tagDifficulty = difficulty ? difficulty.value : undefined;
      this.tagDok = this.populateExerciseTagLevel(exerciseTags, TAG_DOKS);
      this.tagBloom = this.populateExerciseTagLevel(exerciseTags, TAG_BLOOMS);
    }

    //general
    this.questionName = question.nickname;
  }

  populateExerciseTagLevel(exerciseTags, tags) {
    return find(tags, tg => {
      const tag = find(exerciseTags, ect => ect.type === 'dok');
      return tag ? tag.value === tg.value : false;
    });
  }

  @action.bound agreeTermsOfUse() {
    this.didUserAgreeTermsOfUse = true;
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

  @computed get authors() {
    // if creating or editing own question, show all teachers in course
    if(this.course.teacher_profiles.length > 0 && (!this.from_exercise_id || this.isUserGeneratedQuestion)) {
      return [...this.course.teacher_profiles];
    }
    else if (this.exercise) {
      // if editing an openstax question or other teacher's question,
      // show current user and current author only
      return [this.exercise.author, this.course.getCurrentUser];
    }
    return [this.course.getCurrentUser];
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

  @computed get filledOptions() {
    return filter(this.options, o => !S.isEmpty(S.stripHTMLTags(o.text)));
  }

  @computed get isReadyToPublish() {
    // check chapter and section
    const isTopicSelected = Boolean(this.selectedChapter && this.selectedChapterSection);
    // check question section
    let isQuestionFilled;
    if(this.isMCQ) {
      isQuestionFilled = Boolean(this.questionText && this.filledOptions.length >= 2 && some(this.filledOptions, fo => fo.isCorrect));
    }
    else {
      isQuestionFilled = Boolean(this.questionText);
    }
    // check author
    const isAuthorSelected = Boolean(this.author);

    return isTopicSelected && isQuestionFilled && isAuthorSelected;
  }

  // actions for topic form section
  @action.bound setSelectedChapterByUUID(uuid) {
    if(this.selectedChapter && this.selectedChapter.uuid === uuid) return;
    this.selectedChapter = find(this.preSelectedChapters, psc => psc.uuid === uuid);
    if(this.preSelectedChapterSections.length === 1) {
      this.selectedChapterSection = this.preSelectedChapterSections[0];
    }
    else {
      this.selectedChapterSection = null;
    }
    this.isEmpty.selectedChapter = false;
  }

  @action.bound setSelectedChapterSectionByUUID(uuid) {
    this.selectedChapterSection = find(this.preSelectedChapterSections, pscs => pscs.uuid === uuid);
    this.isEmpty.selectedChapterSection = false;
  }

  // actions for question form section
  @action.bound changeQuestionText(text) {
    this.questionText = text;
    if(!S.isEmpty(S.stripHTMLTags(text))) {
      this.isEmpty.questionText = false;
    }
  }

  // called when an image is added to the HTML for question text
  @action.bound onImageUpload(blob, url) { // eslint-disable-line no-unused-vars
    // TODO save blob.signed_id and send them to BE when the exercise is saved
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
    this.isEmpty.correctOption = false;
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

  @action.bound changeDetailedSolution(text) {
    this.detailedSolution = text;
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

  @action.bound changeAuthor(userProfileId) {
    this.author = find(this.course.teacher_profiles, tp => tp.id == userProfileId);
  }

  @action.bound changeAllowOthersCopyEdit({ target: { checked } }) {
    this.allowOthersCopyEdit = checked;
  }

  @action.bound changeAnnonymize({ target: { checked } }) {
    this.annonymize = checked;
  }

  @action.bound changeExcludeOriginal({ target: { checked } }) {
    this.excludeOriginal = checked;
  }

  @action async publish(shouldExit) {
    if(!this.hasAnyFeedback()) {
      this.feedbackTipModal = {
        show: true,
        shouldExitOnPublish: shouldExit,
      };
    }
    else {
      this.doPublish(shouldExit);
    }
  }

  @action async doPublish(shouldExit) {
    await this.exercises.createExercise({
      course: this.course,
      data: {
        selectedChapterSection: this.selectedChapterSection.id,
        authorId: this.author.id,
        derived_from_id: this.from_exercise_id,
        questionText: this.questionText,
        questionName: this.questionName,
        options: this.processOptions(),
        detailedSolution: this.detailedSolution,
        isTwoStep: this.isTwoStep,
        tags: this.processTags(),
        annonymize: this.annonymize,
        copyable: this.allowOthersCopyEdit,
      },
    });

    if(shouldExit) {
      this.onDisplayModal(false);
    }
    else {
      this.resetForm();
    }

    if(this.feedbackTipModal.show) {
      this.feedbackTipModal = {
        show: false,
        shouldExitOnPublish: false,
      };
    }
  }

  processTags() {
    const tagkeys = ['tagTime', 'tagDifficulty', 'tagBloom', 'tagDok'];
    let tags = {};
    forEach(tagkeys, key => {
      if(this[key]) {
        tags[key] = { value: parseInt(this[key].value, 10) || this[key] };
      }
    });

    return tags;
  }

  processOptions() {
    return map(this.filledOptions, o => {
      return {
        content: o.text,
        feedback: o.feedback,
        correctness: o.isCorrect ? '1.0' : '0.0',
      };
    });
  }

  @action resetForm() {
    this.questionText = '';
    this.isTwoStep = false;
    forEach(this.options, o => {
      o.text = '';
      o.feedback = '';
      o.isCorrect = false;
    });
    this.detailedSolution = '';
    // tags
    this.tagTime = undefined;
    this.tagDifficulty = undefined;
    this.tagBloom = undefined;
    this.tagDok = undefined;
    // general
    this.questionName = '';
    this.allowOthersCopyEdit = true;
    this.annonymize = false;
    this.excludeOriginal = false;
  }

  @action hasAnyFeedback() {
    return some(this.filledOptions, fo => !S.isEmpty(S.stripHTMLTags(fo.feedback)));
  }

  /**
   * This method checks if the `fields` (fields in the form) are empty.
   * If so, set this.isEmpty[field] to true.
   * NOTE: Each `field` name should match the observable variable name so we can check the thruthy of `this[field]`.
   * @param {*} fields - an array of `field` 
   */
  @action.bound checkValidityOfFields(fields = []) {
    let filterIsEmptyFields;
    // if `fields` is empty, then check all of the `this.isEmpty` fields
    if(fields.length > 0) {
      filterIsEmptyFields = pickBy(this.isEmpty, (ie, key) => {
        return some(fields, f => f === key);
      });
    }
    else {
      filterIsEmptyFields = this.isEmpty;
    }

    forEach(filterIsEmptyFields, (value, key) => {
      // check if there is a corect option selected
      if(key === 'correctOption') {
        this.isEmpty[key] = every(this.options, o => !o.isCorrect);
      }
      else {
        this.isEmpty[key] = !this[key];
      }
    });
  }
}
