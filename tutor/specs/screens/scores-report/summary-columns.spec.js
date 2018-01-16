import { React, SnapShot, Wrapper } from '../../components/helpers/component-testing';
import { map, sortBy } from 'lodash';
import bootstrapScores from '../../helpers/scores-data';
import EnzymeContext from '../../components/helpers/enzyme-context';
import Scores from '../../../src/screens/scores-report/index';

jest.useFakeTimers();

describe('Scores Report summary columns', function() {

  let props;
  let course;
  let period;

  beforeEach(() => {

    ({ course, period } = bootstrapScores());
    props = {
      params: { courseId: course.id },
    };
  });

  it('toggles expanding/collapsing', function() {
    const table = mount(<Scores {...props} />, EnzymeContext.build());
    expect(table.render().find('.overall-average').parent().css('width')).toEqual('90px');
    table.find('.averages-toggle').simulate('click');
    jest.runAllTimers();
    expect(table.render().find('.overall-average').parent().css('width')).toEqual('450px');
    table.find('.averages-toggle').simulate('click');
    jest.runAllTimers();
    expect(table.render().find('.overall-average').parent().css('width')).toEqual('90px');
    table.unmount();
  });

});
