import { Testing, _ } from '../../components/helpers/component-testing';
import EnzymeContext from '../../components/helpers/enzyme-context';
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
    expect(nc.find('.student-name').first().text()).to.equal('Molly Bloom');
    expect(nc.find('.student-id').first().text()).to.equal('123456');
    expect(nc).toHaveRendered('a');
  });

  it('does not render with link for CC', () => {
    props.isConceptCoach = true;
    const nc = mount(<NameCell {...props} />, EnzymeContext.build());
    expect(nc).not.toHaveRendered('a');
  });

});
