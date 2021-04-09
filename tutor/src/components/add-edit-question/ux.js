import { action, observable, computed } from 'vendor';
import { filter, some, find, forEach, pickBy, every, map, isEqual, omit } from 'lodash';
import Toasts from '../../models/toasts';
import { TAG_BLOOMS, TAG_DOKS } from './form/tags/constants';
import User from '../../models/user';
import S from '../../helpers/string';
import { autorun, toJS } from 'mobx';

const TERMS_NAME = 'exercise_editing';
const AUTOSAVE_VERSION = 1; // Iterate this if the form changes significantly
const AUTOSAVE_TTL = 900000; // in milliseconds

export default class AddEditQuestionUX {

  // local
  @observable isMCQ;
  initialStateForm;

  // track emptiness of required fields
  @observable isEmpty = {
      selectedChapter: false,
      selectedChapterSection: false,
      questionText: false,
      correctOption: false,
      options: [false, false],
  }

  //modal
  @observable feedbackTipModal = {
      show: false,
      didShow: false,
      shouldExitOnPublish: false,
  }
  @observable showExitWarningModal = false;
  @observable showPreviewQuestionModal = false;
  @observable showTermsOfUse = false;

  /** props */
  @observable book;
  @observable course;
  // chapter/section ids
  @observable pageIds;
  // Parent of the AddEditQuestion controls the display of the modal
  onDisplayModal;
  // for creating the exercise
  exercises;

  /** form */
  @observable from_exercise_id = null;
  // chapter/sections
  @observable selectedChapter;
  @observable selectedChapterSection;
  // question
  @observable questionText = '';
  @observable isTwoStep = false;
  options = [];
  @observable images = [];
  // detailed solution (MCQ). answer key (WRQ)
  @observable detailedSolution = '';
  // tags
  @observable tagTime;
  @observable tagDifficulty;
  @observable tagBloom;
  @observable tagDok;
  // general
  @observable questionName = '';
  @observable author;
  @observable allowOthersCopyEdit = true;
  @observable anonymize = false;
  @observable excludeOriginal = false;
  @observable changed = false;
  autosaveDisposer;

  constructor(props = {}) {
      this.book = props.book;
      this.course = props.course;
      // props
      this.pageIds = props.pageIds;

      this.onDisplayModal = props.onDisplayModal;
      this.exercises = props.exercises;

      //TODO: get from BE
      // edit or create
      if (props.exercise) {
          this.populateExerciseContent(props.exercise);
          this.clearAutosave();
      }
      else if (this.autosaveIsValid) {
          this.populateFromStorage();
          this.selectDefaultSectionAndChapter()
          this.changed = true;
      }
      else {
          // auto selected if there is only one chapter or selected pre-selected
          this.selectDefaultSectionAndChapter()
          // show 4 options by default
          for(let i = 1; i <= 4; i++) {
              this.options.push({
                  id: i, text: '', feedback: '', isCorrect: false,
              });
          }
          this.isMCQ = true;
      }
      // get author
      this.author = this.authors[0];
      //track initial state
      this.setInitialState();
      // make `this.options` observable after getting a shallow copy of `this.options` in `this.setInitialState`.
      // otherwise, it will keep updating also the inital state of options in `this.initialStateForm`.
      // Observable arrays: https://doc.ebichu.cc/mobx/refguide/array.html
      this.options = observable(this.options);
  }

  @computed get fromExercise() {
      return this.from_exercise_id ? this.exercises.get(this.from_exercise_id) : null;
  }

  @action selectDefaultSectionAndChapter() {
      if(this.preSelectedChapters.length === 1) {
          this.selectedChapter = this.preSelectedChapters[0];
          if(this.preSelectedChapterSections.length === 1) {
              this.selectedChapterSection = this.preSelectedChapterSections[0];
          }
      }
  }

  @action populateFromStorage() {
      // No catch here needed because we check the parse a step up in autosaveIsValid
      const state = JSON.parse(localStorage['ql-editor-state'])
      Object.assign(this, state)
  }

  @action populateExerciseContent(exercise) {
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
              id: a.id,
              text: a.content_html,
              feedback: a.feedback_html,
              isCorrect: a.isCorrect,
          });
      });
      const detailedSolution = find(question.collaborator_solutions, cs => cs.solution_type === 'detailed');
      this.detailedSolution = detailedSolution ? detailedSolution.content_html : '';

      // tags
      if(exercise.content.tags && exercise.tags.length > 0) {
          const exerciseTags = exercise.content.tags;
          const time = find(exerciseTags, t => t.type === 'time');
          const difficulty = find(exerciseTags, t => t.type === 'difficulty');
          this.tagTime = time ? time.value : undefined;
          this.tagDifficulty = difficulty ? difficulty.value : undefined;
          this.tagDok = this.populateExerciseTagLevel(exerciseTags, TAG_DOKS, 'dok');
          this.tagBloom = this.populateExerciseTagLevel(exerciseTags, TAG_BLOOMS, 'blooms');
      }

      //general
      this.questionName = question.title;
  }

  populateExerciseTagLevel(exerciseTags, tags, tagType) {
      return find(tags, tg => {
          const tag = find(exerciseTags, ect => ect.type === tagType);
          return tag ? tag.value === tg.value : false;
      });
  }

  @action setInitialState() {
      this.initialStateForm = {
          selectedChapter: this.selectedChapter,
          selectedChapterSection: this.selectedChapterSection,
          questionText: this.questionText,
          isTwoStep: this.isTwoStep,
          options: this.options.slice(),
          detailedSolution: this.detailedSolution,
          tagTime: this.tagTime,
          tagDifficulty: this.tagDifficulty,
          tagDok: this.tagDok,
          tagBloom: this.tagBloom,
          questionName: this.questionName,
          author: this.author,
          allowOthersCopyEdit: this.allowOthersCopyEdit,
          anonymize: this.anonymize,
          excludeOriginal: this.excludeOriginal,
      };
  }

  @action.bound enableAutosave() {
      this.autosaveDisposer = autorun(() => {
          if (!this.hasAnyChanges) { return null; }
          localStorage['ql-editor-state'] = JSON.stringify(toJS(this.toAutosaveData))
      })
  }

  @action.bound disableAutosave() {
      this.autosaveDisposer()
  }

  @action clearAutosave() {
      localStorage.removeItem('ql-editor-state')
  }

  get autosaveIsValid() {
      let state;
      try {
          state = JSON.parse(localStorage.getItem('ql-editor-state'))
      } catch {
          localStorage.removeItem('ql-editor-state')
          return false
      }
      const now = new Date().getTime()
      const expiry = new Date(state?.autosave?.expiry)?.getTime()
      const version = state?.autosave?.version

      if (state && now < expiry && version === AUTOSAVE_VERSION) {
          return true
      } else {
          localStorage.removeItem('ql-editor-state')
          return false
      }
  }

  @computed get toFormData() {
      return ({
          course: this.course,
          data: {
              selectedChapterSection: this.selectedChapterSection?.id,
              authorId: parseInt(this.author.id, 10),
              derived_from_id: this.from_exercise_id,
              questionText: this.questionText,
              questionName: this.questionName,
              options: this.isMCQ ? this.processOptions() : [],
              detailedSolution: this.detailedSolution,
              isTwoStep: this.isTwoStep,
              tags: this.processTags(),
              anonymize: this.anonymize,
              copyable: this.allowOthersCopyEdit,
              images: this.images.map(img => img.signed_id),
          },
          page_ids: this.selectedChapterSection ? [this.selectedChapterSection.id] : null,
          book: this.course.referenceBook,
      })
  }

  get toAutosaveData() {
      const autosave = {
          expiry: new Date().getTime() + AUTOSAVE_TTL,
          version: AUTOSAVE_VERSION,
      }

      const data = {
          autosave: autosave,
          author: { id: parseInt(this.author.id, 10) },
          from_exercise_id: this.from_exercise_id,
          questionText: this.questionText,
          questionName: this.questionName,
          options: this.options,
          detailedSolution: this.detailedSolution,
          isTwoStep: this.isTwoStep,
          tags: this.tags,
          anonymize: this.anonymize,
          allowOthersCopyEdit: this.allowOthersCopyEdit,
          images: this.images,
          isMCQ: this.isMCQ,
          tagTime: this.tagTime,
          tagDifficulty: this.tagDifficulty,
          tagBloom: this.tagBloom,
          tagDok: this.tagDok,
      };

      return data;
  }

  @computed get didUserAgreeTermsOfUse() {
      return User.terms.hasAgreedTo(TERMS_NAME);
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

  // other users or OpenStax
  @computed get isNonUserGeneratedQuestion() {
      return this.fromExercise && !this.fromExercise.belongsToUser(User);
  }

  @computed get isUserGeneratedQuestion() {
      return this.fromExercise && this.fromExercise.belongsToUser(User);
  }

  @computed get authors() {
      // if creating or editing own question, show all teachers in course
      if(this.course.teacher_profiles.length > 0 && (!this.from_exercise_id || this.isUserGeneratedQuestion)) {
          return [...this.course.teacher_profiles];
      }
      else
          return [this.course.currentUser];
  }

  // Get the browe book link with the chapter or section selected
  @computed get browseBookLink() {
      let browseBookLink = `/book/${this.course.id}`;
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

  @computed get hasAnyFeedback() {
      return some(this.filledOptions, fo => !S.isEmpty(S.stripHTMLTags(fo.feedback)));
  }

  @computed get shouldShowFeedbackTipModal() {
      return !this.hasAnyFeedback && this.isMCQ && !this.feedbackTipModal.didShow;
  }

  @computed get canExit() {
      // ignore check for chapter, section and author
      // after publish, we reset everything except this three fields
      const tempInitialStateForm = omit(this.initialStateForm, ['selectedChapter', 'selectedChapterSection', 'author']);
      return this.changed || some(
          map(tempInitialStateForm, (f, key) => isEqual(this[key], f)),
          t => !t
      );
  }

  @computed get hasAnyChanges() {
      return this.changed || some(
          map(this.initialStateForm, (f, key) => isEqual(this[key], f)),
          t => !t
      );
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
  @action.bound onImageUpload(blob) {
      this.images.push(blob);
  }

  @action.bound changeIsTwoStep({ target: { checked } }) {
      this.isTwoStep = checked;
  }

  @action changeOptions(answer, index) {
      this.options[index].text = answer;
      // if two or more options are filled, then take out the errors
      if(this.filledOptions.length >= 2 && some(this.isEmpty.options, o => o)) {
          this.isEmpty.options[0] = false;
          this.isEmpty.options[1] = false;
      }
      else if (index <= 1 && this.isEmpty.options[index]) {
          this.isEmpty.options[index] = false;
      }
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
          id: this.options.length, text: '', feedback: '', isCorrect: false,
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

  @action.bound changeDetailedSolution(value) {
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
  @action.bound changeQuestionName(value) {
      this.questionName = value;
  }

  @action.bound changeAuthor(userProfileId) {
      this.author = find(this.course.teacher_profiles, tp => tp.id == userProfileId);
  }

  @action.bound changeAllowOthersCopyEdit({ target: { checked } }) {
      this.allowOthersCopyEdit = checked;
  }

  @action.bound changeAnonymize({ target: { checked } }) {
      this.anonymize = checked;
  }

  @action.bound changeExcludeOriginal({ target: { checked } }) {
      this.excludeOriginal = checked;
  }

  @action async publish(shouldExit) {
      // only show feedback tip modal if form is MCQ
      if(this.shouldShowFeedbackTipModal) {
          this.feedbackTipModal = {
              show: true,
              didShow: true,
              shouldExitOnPublish: shouldExit,
          };
      }
      else {
          this.doPublish(shouldExit);
      }
  }

  @action async doPublish(shouldExit) {
      // store exericse since saving the new one it might remove old from map
      const exercise = this.from_exercise_id ? this.exercises.get(this.from_exercise_id) : null;

      await this.exercises.createExercise(this.toFormData).then(() => {
          this.clearAutosave();
          this.disableAutosave();
          this.changed = false;
          this.enableAutosave();
      });

      // notify UI
      Toasts.push({ handler: 'questionPublished', status: 'ok' });
      // exclude original exercise
      if (this.excludeOriginal && exercise) {
          this.course.saveExerciseExclusion({ exercise, is_excluded: true });
      }
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
              didShow: this.feedbackTipModal.didShow,
          };
      }
  }

  processTags() {
      const tagkeys = ['tagTime', 'tagDifficulty', 'tagBloom', 'tagDok'];
      let tags = {};
      forEach(tagkeys, key => {
          if(this[key]) {
              tags[key] = { value: this[key].value || this[key] };
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
      this.anonymize = false;
      this.excludeOriginal = false;
      this.images.clear();
  }

  @action.bound doExitForm() {
      if(this.canExit){
          this.showExitWarningModal = true;
      }
      else {
          this.onDisplayModal(false);
      }
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
          else if (key === 'options' && this.filledOptions.length <= 1) {
              // if there ar no filled options, show the inline error in the first two option editors
              if(this.filledOptions.length === 0) {
                  this.isEmpty[key][0] = true;
                  this.isEmpty[key][1] = true;
              }
              else if (this.filledOptions.length === 1) {
                  // show error in the first option editor
                  this.isEmpty[key][0] = S.isEmpty(S.stripHTMLTags(this[key][0].text));
                  // show error in the second option editor if the first is filled
                  this.isEmpty[key][1] = S.isEmpty(S.stripHTMLTags(this[key][1].text)) && !this.isEmpty[key][0];
              }
          }
          else {
              this.isEmpty[key] = typeof this[key] === 'string' ? S.isEmpty(S.stripHTMLTags(this[key])) : !this[key];
          }
      });
  }
}
