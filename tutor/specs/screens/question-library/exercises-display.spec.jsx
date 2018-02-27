import { React, SnapShot } from '../helpers/component-testing';
import Factory, { FactoryBot } from '../../factories';
import ExercisesDisplay from '../../../src/components/questions/exercises-display';

jest.mock('../../../../shared/src/components/html');
jest.mock('../../../../shared/src/components/pinned-header-footer-card', (() => (
  ({children}) => children
)));

describe('QL exercises display', function() {

  let props, book, exercises, course;

  beforeEach(() => {
    course = Factory.course();
    course.referenceBook.onApiRequestComplete({ data: [FactoryBot.create('Book')] });
    const pageIds = course.referenceBook.pages.byId.keys();
    exercises = Factory.exercisesMap({ ecosystem_id: course.ecosystem_id, pageIds, count: 4 });
    props = {
      pageIds,
      course,
      exercises,
      helpTooltip: 'This is help',
    };
  });

  //  afterEach(() => ExerciseActions.saveExerciseExclusion.restore());

  it('renders and matches snapshot', function() {
    const component = SnapShot.create(<ExercisesDisplay {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  fit('renders homework and reading cards', function() {
    const ex = mount(<ExercisesDisplay {...props} />);

    // expect(ex).not.toHaveRendered(
    // console.log(component.find)
    // expect(component.toJSON()).toMatchSnapshot();
  });

  it('displays dialog when exercises are at minimum (5)', function() {
    expect(EXERCISES.items.length).to.equal(5)

    Testing.renderComponent( ExercisesDisplay, {props} ).then(function({dom}) {
      Testing.actions.click(dom.querySelector('.openstax-exercise-preview .action.exclude'))

      expect( ExerciseActions.saveExerciseExclusion ).not.to.have.been.called;
      expect( document.querySelector('.question-library-min-exercise-exclusions') ).to.exist;
      Testing.actions.click(
        document.querySelector('.question-library-min-exercise-exclusions .btn-default')
      );
      return (
        expect( ExerciseActions.saveExerciseExclusion ).to.have.been.called
      );
    });
  });

});
