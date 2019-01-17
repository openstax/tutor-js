import { EnzymeContext } from '../../helpers';
import NameCell from '../../../src/screens/scores-report/name-cell';
import bootstrapScores from '../../helpers/scores-data';
import UX from '../../../src/screens/scores-report/ux';

describe('Student Scores Name Cell', function() {
  let props;

  beforeEach(function() {
    const { course } = bootstrapScores();
    props = {
      ux: new UX(course),
      rowIndex: 1,
    };
  });

  it('renders with name and id', () => {
    const student = props.ux.students[props.rowIndex];
    const nc = mount(<NameCell {...props} />, EnzymeContext.build());
    expect(nc.find('.student-name').first().text()).toEqual(student.name);
    expect(nc.find('.student-id').first().text()).toEqual(student.student_identifier);
    expect(nc).toHaveRendered('a');
  });

});
