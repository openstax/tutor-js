import { Testing, expect, sinon, _, ReactTestUtils } from '../../helpers';
import { Exercise } from 'components/exercise';
import STEP from './step-data';
const CHOICES = STEP.content.questions[0].answers;

let step = null;
let props = null;

const canOnlyContinue = partId => false;

const FREE_RESPONSE_PROPS = {
  taskId: '1',
  onStepCompleted: jest.fn(),
  onNextStep: jest.fn(),

  getCurrentPanel(id) {
    let panel = 'free-response';
    if (step.answer_id) {
      panel = 'review';
    } else if (step.free_response) {
      panel = 'multiple-choice';
    }
    return panel;
  },

  onFreeResponseChange: jest.fn(),
  setFreeResponseAnswer: jest.fn((stepId, freeResponse) => step.free_response = freeResponse),
  setAnswerId: jest.fn(jest.fn((stepId, answerId) => step.answer_id = answerId)),
  getReadingForStep: jest.fn(),
  refreshStep: jest.fn(),
  recoverFor: jest.fn(),
  canOnlyContinue: jest.fn(canOnlyContinue),
  review: '',
  focus: false,
  courseId: '1',
  canTryAnother: false,
  canReview: true,
  disabled: false,
  task: STEP,
};

const resetProps = function() {
  step = _.clone(STEP);
  props = _.clone(FREE_RESPONSE_PROPS);
  props.parts = [step];
  return props.project = 'tutor';
};

const exerciseActionsAndChecks = {
  enterFreeResponse({ dom, wrapper, element }, freeResponse = 'HELLO') {
    const { textarea } = Testing.actions._fillTextarea('textarea', freeResponse, { div: dom });
    expect(textarea.value).equals(freeResponse);
    return expect(props.onFreeResponseChange).toHaveBeenCalledWith(step.id, freeResponse);
  },

  // no setprops
  // wrapper.setProps({})
  // expect(dom.querySelector('.free-response').textContent).equals(freeResponse)
  continueOnFreeResponse({ dom, wrapper, element }, freeResponse = 'HELLO') {
    Testing.actions._clickMatch('.continue', { div: dom });
    expect(props.setFreeResponseAnswer).toHaveBeenCalledWith(step.id, freeResponse);
    return expect(step.free_response).equals(freeResponse);
  },

  updateToMultipleChoice({ dom, wrapper }) {
    expect(dom.querySelector(
      '.openstax-exercise-card .exercise-multiple-choice'
    )).nottoBeNull();

    expect(_.pluck(dom.querySelectorAll('.answer-content'), 'textContent')).toEqual(_.pluck(CHOICES, 'content_html'));
    return expect(dom.querySelectorAll('.answer-input-box:not([disabled])')).toHaveLength(CHOICES.length);
  },

  pickMultipleChoice({ dom, wrapper }) {
    const choicesDOMs = dom.querySelectorAll('.answer-input-box');

    const FIRST_CHOICE_INDEX = 0;
    const SECOND_CHOICE_INDEX = 1;

    Testing.actions._changeDOMNode(choicesDOMs[FIRST_CHOICE_INDEX]);
    expect(_.pluck(dom.querySelectorAll('.answer-checked .answer-content'), 'textContent'))
      .toEqual([CHOICES[FIRST_CHOICE_INDEX].content_html]);
    expect(props.setAnswerId).toHaveBeenCalledWith(step.id, CHOICES[FIRST_CHOICE_INDEX].id);

    Testing.actions._changeDOMNode(choicesDOMs[SECOND_CHOICE_INDEX]);
    expect(_.pluck(dom.querySelectorAll('.answer-checked .answer-content'), 'textContent'))
      .toEqual([CHOICES[SECOND_CHOICE_INDEX].content_html]);
    return expect(props.setAnswerId).toHaveBeenCalledWith(step.id, CHOICES[SECOND_CHOICE_INDEX].id);
  },

  // wrapper?.setProps({})
  setCorrectAnswerAndFeedback(renderedData, choiceIndex = 0) {
    const { wrapper, dom } = renderedData;

    if (dom != null) { Testing.actions._clickMatch('.continue', { div: dom }); }

    step.correct_answer_id = CHOICES[choiceIndex].id;
    return step.feedback_html = 'The original hypothesis is incorrect.';
  },

  checkCorrectAnswerAndFeedback({ dom, wrapper }, choiceIndex = 0) {
    expect(dom.querySelector(
      '.openstax-exercise-card .exercise-review'
    )).nottoBeNull();

    expect(dom.querySelector('.question-feedback').textContent).equals(step.feedback_html);
    expect(dom.querySelector('.answer-correct .answer-content').textContent).equals(CHOICES[choiceIndex].content_html);
    expect(dom.querySelectorAll('.answer-input-box')).toHaveLength(0);
    return expect(dom.querySelector('button.continue').textContent).equals('Next Question');
  },

  continueToNextStep({ dom, wrapper, element }) {
    Testing.actions._clickMatch('.continue', { div: dom });
    return expect(props.onNextStep).to.have.been.called;
  },
};

xdescribe('Exercise Component', function() {

  beforeEach(() => resetProps());

  it('renders with css classes', () =>
    Testing.renderComponent( Exercise, { props } ).then(({ dom }) =>
      expect(dom.querySelector(
        '.openstax-exercise-card .exercise-free-response'
      )).nottoBeNull()
    )
  );

  it('can fill textarea for free respone', () =>
    Testing.renderComponent( Exercise, { props } ).then((...args) => exerciseActionsAndChecks.enterFreeResponse(...Array.from(args || [])))
  );

  it('will update step on continue from filling in free response', () =>
    Testing.renderComponent( Exercise, { props } ).then(function(...args) {

      exerciseActionsAndChecks.enterFreeResponse(...Array.from(args || []));
      return exerciseActionsAndChecks.continueOnFreeResponse(...Array.from(args || []));
    })
  );

  xit('renders multiple choices after continuing from free response', () =>
    Testing.renderComponent( Exercise, { props } ).then(function(...args) {

      exerciseActionsAndChecks.enterFreeResponse(...Array.from(args || []));
      exerciseActionsAndChecks.continueOnFreeResponse(...Array.from(args || []));
      return exerciseActionsAndChecks.updateToMultipleChoice(...Array.from(args || []));
    })
  );

  xit('can update the multiple choice through the interface', () =>
    Testing.renderComponent( Exercise, { props } ).then(function(...args) {

      exerciseActionsAndChecks.enterFreeResponse(...Array.from(args || []));
      exerciseActionsAndChecks.continueOnFreeResponse(...Array.from(args || []));
      exerciseActionsAndChecks.updateToMultipleChoice(...Array.from(args || []));
      return exerciseActionsAndChecks.pickMultipleChoice(...Array.from(args || []));
    })
  );

  xit('can update the multiple choice through key presses', () =>
    Testing.renderComponent( Exercise, { props } ).then(function(...args) {

      exerciseActionsAndChecks.enterFreeResponse(...Array.from(args || []));
      exerciseActionsAndChecks.continueOnFreeResponse(...Array.from(args || []));
      exerciseActionsAndChecks.updateToMultipleChoice(...Array.from(args || []));
      return exerciseActionsAndChecks.keyInMultipleChoice(...Array.from(args || []));
    })
  );

  xit('renders a review if correct answer and feedback are available after multiple-choice submit', () =>
    Testing.renderComponent( Exercise, { props } ).then(function(...args) {

      exerciseActionsAndChecks.enterFreeResponse(...Array.from(args || []));
      exerciseActionsAndChecks.continueOnFreeResponse(...Array.from(args || []));
      exerciseActionsAndChecks.updateToMultipleChoice(...Array.from(args || []));
      exerciseActionsAndChecks.pickMultipleChoice(...Array.from(args || []));
      exerciseActionsAndChecks.setCorrectAnswerAndFeedback(...Array.from(args || []));
      return exerciseActionsAndChecks.checkCorrectAnswerAndFeedback(...Array.from(args || []));
    })
  );

  xit('attempts next step on continue from review mode', () =>
    Testing.renderComponent( Exercise, { props } ).then(function(...args) {

      exerciseActionsAndChecks.enterFreeResponse(...Array.from(args || []));
      exerciseActionsAndChecks.continueOnFreeResponse(...Array.from(args || []));
      exerciseActionsAndChecks.updateToMultipleChoice(...Array.from(args || []));
      exerciseActionsAndChecks.pickMultipleChoice(...Array.from(args || []));
      exerciseActionsAndChecks.setCorrectAnswerAndFeedback(...Array.from(args || []));
      exerciseActionsAndChecks.checkCorrectAnswerAndFeedback(...Array.from(args || []));
      return exerciseActionsAndChecks.continueToNextStep(...Array.from(args || []));
    })
  );

  xit('attempts next step if correct answer and feedback are not available after multiple-choice submit', function() {
    props.canReview = false;

    return Testing.renderComponent( Exercise, { props } ).then(function(...args) {

      exerciseActionsAndChecks.enterFreeResponse(...Array.from(args || []));
      exerciseActionsAndChecks.continueOnFreeResponse(...Array.from(args || []));
      exerciseActionsAndChecks.updateToMultipleChoice(...Array.from(args || []));
      exerciseActionsAndChecks.pickMultipleChoice(...Array.from(args || []));
      return exerciseActionsAndChecks.continueToNextStep(...Array.from(args || []));
    });
  });


  it('renders a free response if given', function() {
    step.free_response = 'hi hi';

    return Testing.renderComponent( Exercise, { props } ).then(({ dom }) => expect(dom.querySelector('.free-response').textContent).equals('hi hi'));
  });

  // setProps is now gone, need to find replacement
  xit('updates free response when passed new ones', function() {
    step.free_response = 'hi hi';

    return Testing.renderComponent( Exercise, { props } ).then(function({ dom, wrapper }) {
      step.free_response = 'bye bye';

      wrapper.setProps({ step });
      return expect(dom.querySelector('.free-response').textContent).equals('bye bye');
    });
  });

  it('renders a chosen multiple choice if given', function() {
    step.answer_id = CHOICES[0].id;

    return Testing.renderComponent( Exercise, { props } ).then(({ dom }) => expect(dom.querySelector('.answer-checked .answer-content').textContent).equals(CHOICES[0].content_html));
  });

  // setProps is now gone, need to find replacement
  return xit('updates chosen answer when passed in updates', function() {
    step.answer_id = CHOICES[0].id;

    return Testing.renderComponent( Exercise, { props } ).then(function({ dom, wrapper }) {
      step.answer_id = CHOICES[2].id;
      // something weird is happening, the new property seems to force the component to notice it's receiving new props.
      wrapper.setProps({ step, hack: '' });
      return expect(dom.querySelector('.answer-checked .answer-content').textContent).equals(CHOICES[2].content_html);
    });
  });
});
