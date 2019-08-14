import { C, React } from '../../helpers';
import ScoresUX from '../../../src/screens/scores-report/ux';
import bootstrapScores from '../../helpers/scores-data.js';
import Table from '../../../src/screens/scores-report/table';

describe('Student Scores Report Table', () => {
  let course;
  let props;
  let ux;

  beforeEach(function() {
    ({ course } = bootstrapScores());
    ux = new ScoresUX(course);
    props = {
      ux,
    };
  });

  it('renders no students only to teachers', function() {
    course.periods[0].num_enrolled_students = 0;
    const table = mount(<C><Table {...props} /></C>);
    expect(table).toHaveRendered('.no-students');
    course.currentRole.type = 'student';
    expect(table).not.toHaveRendered('.no-students');
    table.unmount();
  });
});
