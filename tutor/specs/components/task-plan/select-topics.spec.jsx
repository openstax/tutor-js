import { React, SnapShot } from '../helpers/component-testing';
import Factory, { FactoryBot } from '../../factories';
import SelectTopics from '../../../src/components/task-plan/select-topics';
import HOMEWORK from '../../../api/plans/2.json';

describe('Select Topics', function() {
  let props, course;

  beforeEach(() => {
    const course = Factory.course();
    course.referenceBook.onApiRequestComplete({
      data: [FactoryBot.create('Book')],
    });

    props = {
      course,
      planId: HOMEWORK.id,
      onSectionChange: jest.fn(),
      hide: jest.fn(),
      selected: [],
      header: 'Section Chooser Header',
      cancel: jest.fn(),
    };
  });

  it('matches snapshot', function() {
    expect(SnapShot.create(<SelectTopics {...props} />).toJSON()).toMatchSnapshot();
  });

});
