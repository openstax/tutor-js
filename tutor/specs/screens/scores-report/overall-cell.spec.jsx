import { React } from '../../helpers';
import bootstrapScores from '../../helpers/scores-data.js';
import Cell from '../../../src/screens/scores-report/overall-cell';
import ScoresUX from '../../../src/screens/scores-report/ux';

describe('Student Scores Overall Cell', function() {

  let props;
  let ux;

  beforeEach(() => {
    const { course } = bootstrapScores();
    ux = new ScoresUX(course);
    props = {
      ux,
      students: ux.period.students,
      rowIndex: 2,
    };
  });

  it('renders correct row for index', () => {
    const cell = mount(<Cell {...props} />);
    expect(cell.text()).toEqual('5%23%98%42%9%');
    Object.assign(ux.period.students[props.rowIndex], {
      course_average: 1,
      homework_score: 0.3,
      homework_progress: 0.3,
      reading_score: 0.9,
      reading_progress: 1,
    });
    expect(cell.text()).toEqual('100%30%30%90%100%');
  });

});
