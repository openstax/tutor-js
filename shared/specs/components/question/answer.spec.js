/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { Testing, expect, sinon, _, ReactTestUtils } from 'shared/specs/helpers';

import { Answer } from 'components/question/answer';
import STEP from '../exercise/step-data';

const ANSWER = {
  'id': '40641',
  'content_html': 'solid',
  'feedback_html': 'feedback yo',
};

describe('Answer Component', function() {
  let props;
  let propsWithFeedback = (props = null);

  beforeEach(function() {
    props = {
      answer: ANSWER,
      type: 'student',
    };

    return propsWithFeedback = {
      answer: ANSWER,
      type: 'student',
      show_all_feedback: true,
    };
  });

  it('renders answer', () =>
    Testing.renderComponent( Answer, { props } ).then(function({ dom }) {
      const answers = _.pluck(dom.querySelectorAll('.answer-content'), 'textContent');
      return expect(answers).to.deep.equal(['solid']);
    })
  );

  return it('renders answer feedback based on props', () =>

    Testing.renderComponent( Answer, { props: propsWithFeedback } ).then(function({ dom }) {
      const answers = _.pluck(dom.querySelectorAll('.question-feedback-content'), 'textContent');
      return expect(answers).to.deep.equal(['feedback yo']);
    })
  );
});
