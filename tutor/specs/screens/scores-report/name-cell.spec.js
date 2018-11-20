import { EnzymeContext } from '../../helpers';
import NameCell from '../../../src/screens/scores-report/name-cell';


describe('Student Scores Name Cell', function() {
  let props;

  beforeEach(function() {
    props = {
      courseId: '1',
      isConceptCoach: false,
      students: [{
        first_name: 'Molly',
        last_name: 'Bloom',
        role: 1,
        student_identifier: '123456',
      }],
    };
  });

  it('renders with name and id', () => {
    const nc = mount(<NameCell {...props} />, EnzymeContext.build());
    expect(nc.find('.student-name').first().text()).toEqual('Molly Bloom');
    expect(nc.find('.student-id').first().text()).toEqual('123456');
    expect(nc).toHaveRendered('a');
  });

  it('does not render with link for CC', () => {
    props.isConceptCoach = true;
    const nc = mount(<NameCell {...props} />, EnzymeContext.build());
    expect(nc).not.toHaveRendered('a');
  });

});
