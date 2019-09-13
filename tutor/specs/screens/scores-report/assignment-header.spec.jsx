import { React } from '../../helpers';
import bootstrapScores from '../../helpers/scores-data.js';
import UX from '../../../src/screens/scores-report/ux';
import Header from '../../../src/screens/scores-report/assignment-header';

describe('Scores Report: assignment column header', function() {
  let props;
  let heading;

  beforeEach(function() {
    const { course, period } = bootstrapScores();
    heading = period.data_headings[0];
    const ux = new UX(course);
    props = {
      courseId: course.id,
      ux,
      columnIndex: 0,
      onSort: jest.fn(),
      sort: {},
      period: ux.period,
    };
  });

  it('renders and matches snapshot', () => {
    const wrapper = shallow(<Header {...props} />);
    expect(wrapper.find('.header-cell.title').render().text()).toEqual(heading.title);
    expect(wrapper).toHaveRendered('Time');
  });

  it('renders properly when average is undefined for an external assignment', () => {
    props.columnIndex = 2;
    props.ux.periodTasksByType.external.average_progress = undefined;

    const wrapper = shallow(<Header {...props} />);
    expect(wrapper.render().find('.click-rate').text()).toEqual('0% clicked on time');
  });


});
