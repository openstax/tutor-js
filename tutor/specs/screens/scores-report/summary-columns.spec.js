import { EnzymeContext, React } from '../../helpers';
import { map, sortBy } from 'lodash';
import bootstrapScores from '../../helpers/scores-data';
import Scores from '../../../src/screens/scores-report/index';

jest.mock('../../../src/helpers/bezier', () => ({ range, onStep, onComplete }) => {
  onStep(range[1]);
  onComplete();
});

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
    expect(table.render().find('.overall-average').parent().css('width')).toEqual('450px');
    table.find('Icon[className="averages-toggle"]').simulate('click');
    expect(table.render().find('.overall-average').parent().css('width')).toEqual('120px');
    table.unmount();
  });

});
