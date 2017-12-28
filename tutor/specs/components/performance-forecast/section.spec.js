import { Testing, _ } from '../helpers/component-testing';
import { bootstrapCoursesList } from '../../courses-test-data';
import Section from '../../../src/components/performance-forecast/section';

import GUIDE from '../../../api/user/courses/1/guide.json';

import pluralize from 'pluralize';

describe('Learning Guide Section Panel', function() {

  let props;

  beforeEach(function() {
    bootstrapCoursesList();
    props = {
      section: GUIDE.children[0].children[0],
      courseId: '1',
    };});

  it('displays the title', function() {
    return Testing.renderComponent( Section, { props: props } ).then(({ dom }) => {
      return expect(dom.querySelector('.title').textContent).to.equal(props.section.title);
    });
  });

  return it('reports how many problems were worked', function() {
    const total = props.section.questions_answered_count;

    return Testing.renderComponent( Section, { props: props } ).then(({ dom }) =>
      _.delay(() =>
        expect(dom.querySelector('.amount-worked').textContent).to
          .equal(`${pluralize(' problems', total, true)} worked in this section`)
      )
    );
  });
});
