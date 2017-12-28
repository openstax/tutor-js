import { Testing, _ } from '../helpers/component-testing';
import { bootstrapCoursesList } from '../../courses-test-data';

import Weaker from '../../../src/components/performance-forecast/weaker-panel';
import PerformanceForecast from '../../../src/flux/performance-forecast';
import GUIDE from '../../../api/courses/1/guide.json';
const COURSE_ID = '1';
describe('Weaker Section Panel', function() {
  let props;

  beforeEach(function() {
    bootstrapCoursesList();
    PerformanceForecast.Student.actions.loaded(GUIDE, COURSE_ID);
    return props = {
      courseId: '1',
      sections: PerformanceForecast.Student.store.getAllSections(COURSE_ID),
      weakerTitle: 'Weaker',
      weakerExplanation: 'Stuff you suck at',
      weakerEmptyMessage: 'Not enough data',
    };});

  it('displays the title', function() {
    return Testing.renderComponent( Weaker, { props: props } ).then(({ dom }) => {
      return expect(dom.querySelector('.title').textContent).to.equal(props.weakerTitle);
    });
  });


  it('hides practice button if canPractice property is not given', function() {
    return Testing.renderComponent( Weaker, { props: props } ).then(function({ dom }) {
      const practice = dom.querySelector('.practice.btn');
      return expect(practice).to.be.null;
    });
  });

  it('does not render if there are no sections', function() {
    props.sections = [];
    return Testing.renderComponent( Weaker, { props: props } ).then(({ dom }) => expect( dom ).to.be.null);
  });

  return it('hides practice button if no sections are shown', function() {
    const section = _.first(props.sections);
    props.sections = [section];

    Testing.renderComponent( Weaker, { props: props } ).then(({ dom }) => expect( dom.querySelector('.practice.btn' ) ).to.not.be.null);

    section.is_real = false;

    return Testing.renderComponent( Weaker, { props: props } ).then(({ dom }) => expect( dom.querySelector('.practice.btn' ) ).to.be.null);
  });
});
