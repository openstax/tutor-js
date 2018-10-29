import { React, SnapShot } from 'helpers';
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
    expect.snapshot(<SelectTopics {...props} />).toMatchSnapshot();
  });

});
