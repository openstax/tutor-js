import { React } from '../../helpers';
import bootstrapScores from '../../helpers/scores-data.js';
import OverallHeader from '../../../src/screens/scores-report/overall-header';
import ScoresUX from '../../../src/screens/scores-report/ux';

describe('Student Scores Overall Cell', function() {

  let props;
  let ux;

  beforeEach(() => {
    const { course } = bootstrapScores();
    ux = new ScoresUX(course);
    props = {
      ux,
      rowIndex: 2,
    };
  });

  it('renders and matches snapshot', () => {
    const header = mount(<OverallHeader {...props} />);
    expect(header.debug()).toMatchSnapshot();
  });
});
