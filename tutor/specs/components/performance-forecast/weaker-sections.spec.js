import { Testing, ld } from 'helpers';
import { bootstrapCoursesList } from '../../courses-test-data';
import Sections from '../../../src/components/performance-forecast/weaker-sections';
import PerformanceForecast from '../../../src/flux/performance-forecast';
import GUIDE from '../../../api/courses/1/guide.json';

describe('Weaker Sections listing', function() {
  let props;

  beforeEach(function() {
    bootstrapCoursesList();
    PerformanceForecast.Student.actions.loaded(GUIDE, '1');
    return props = {
      courseId: '1',
      sections: PerformanceForecast.Student.store.getAllSections('1'),
      weakerEmptyMessage: 'Not enough data',
    };});

  it('renders forecast bars', function() {
    return Testing.renderComponent( Sections, { props: props } ).then(function({ dom }) {
      expect(dom.querySelectorAll('.section').length).toEqual(1);
      expect(dom.querySelector('.section:first-child .title').textContent).to
        .equal('Newton\'s First Law of Motion: Inertia');
    });
  });

});
