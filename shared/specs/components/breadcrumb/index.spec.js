import { Testing, expect, sinon, _ } from 'shared/specs/helpers';

import BC from 'components/breadcrumb';

describe('Breadcrumb Component', function() {
  let props = null;

  beforeEach(() =>
    props = {
      goToStep: sinon.spy(),

      step: {
        type: 'reading',
        is_completed: true,
        correct_answer_id: 1,
        task: { title: 'My Assignment' },
      },

      canReview: true,
      currentStep: 1,
      stepIndex: 2,

      crumb: {
        type: 'reading',
        labels: ['hot'],
      },
    });

  describe('Title', function() {
    it('indicates current step', function() {
      props.stepIndex = 1;
      props.step.is_completed = false;
      return Testing.renderComponent( BC, { props } ).then(({ dom }) => expect(dom.getAttribute('title')).equal('Current Step (reading)'));
    });
    it('indicates completed', function() {
      props.step.is_completed = true;
      return Testing.renderComponent( BC, { props } ).then(({ dom }) => expect(dom.getAttribute('title')).equal('Step Completed (reading). Click to review'));
    });
    return it('shows end', function() {
      props.crumb.type = 'end';
      return Testing.renderComponent( BC, { props } ).then(({ dom }) => expect(dom.getAttribute('title')).equal('My Assignment Completion'));
    });
  });


  describe('Status', function() {
    it('can be correct', function() {
      props.canReview = true;
      props.step.is_correct = true;
      return Testing.renderComponent( BC, { props } ).then(function({ dom }) {
        expect(dom.classList.contains('status-correct')).toBe(true);
        return expect(dom.querySelector('i.icon-correct')).not.to.be.null;
      });
    });
    it('can be incorrect', function() {
      props.canReview = true;
      props.step.answer_id = 11;
      return Testing.renderComponent( BC, { props } ).then(function({ dom }) {
        expect(dom.classList.contains('status-incorrect')).toBe(true);
        return expect(dom.querySelector('i.icon-incorrect')).not.to.be.null;
      });
    });

    return it('passes on data-label props', function() {
      props['data-label'] = 'This is a Label';
      return Testing.renderComponent( BC, { props } ).then(({ dom }) => {
        return expect(dom.getAttribute('data-label')).toEqual(props['data-label']);
      });
    });
  });

  return it('calls onClick handler', () =>
    Testing.renderComponent( BC, { props } ).then(({ dom }) => {
      Testing.actions.click(dom);
      return expect(props.goToStep).to.have.been.calledWith(2);
    })
  );
});
