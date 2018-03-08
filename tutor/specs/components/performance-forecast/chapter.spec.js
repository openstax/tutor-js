import { Testing, _ } from '../helpers/component-testing';
import { bootstrapCoursesList } from '../../courses-test-data';
import Chapter from '../../../src/components/performance-forecast/chapter';

import GUIDE from '../../../api/user/courses/1/guide.json';

import pluralize from 'pluralize';

describe('Learning Guide Chapter Panel', function() {
  let props;

  beforeEach(function() {
    bootstrapCoursesList();
    props = {
      chapter: GUIDE.children[0],
      courseId: '1',
    };});

  it('reports how many problems were worked', function() {
    const total = props.chapter.questions_answered_count;

    return Testing.renderComponent( Chapter, { props: props } ).then(({ dom }) =>
      _.delay(async () => {
        expect(await axe(dom.outerHTML)).toHaveNoViolations();
        expect(dom.querySelector('.amount-worked').textContent).to
          .equal(`${pluralize(' problems', total, true)} worked in this chapter`)
      })
    );
  });

  return it('displays the title', function() {
    return Testing.renderComponent( Chapter, { props: props } ).then(async ({ dom }) => {
      expect(await axe(dom.outerHTML)).toHaveNoViolations();
      return expect(dom.querySelector('.title').textContent).to.equal(props.chapter.title);
    });
  });
});
