import { C, R } from '../../helpers';
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
    const nc = mount(<R><NameCell {...props} /></R>);
    expect(nc.find('.student-name').first().text()).toEqual(student.name);
    expect(nc.find('.student-id').first().text()).toEqual(student.student_identifier);
    expect(nc).toHaveRendered('a');
  });

  it('renders without link for dropped students', () => {
    const student = props.ux.students[0];
    student.is_dropped = true; // this moves it to the end
    props.rowIndex = props.ux.students.length - 1;
    const nc = mount(<C><NameCell {...props} /></C>);
    expect(nc).not.toHaveRendered('TutorLink');
    expect(nc.text()).toContain(student.name);
    expect.snapshot(<C><NameCell {...props} /></C>).toMatchSnapshot();
  });
});
