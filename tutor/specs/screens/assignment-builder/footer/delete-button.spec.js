import { Factory } from '../../../helpers';
import DeleteBtn from '../../../../src/screens/assignment-builder/footer/delete-button';

describe('Task Plan Builder: Delete button', () => {

  let props;
  beforeEach(() => {
    props = {
      ux: {
        plan: { isNew: false },
        course: Factory.course({
          appearance_code: 'college_biology',
        }),
      },
    };
  });

  fit('renders when plan is not new', () => {
    props.ux.plan.isNew = true;
    const btn = shallow(<DeleteBtn {...props} />);
    expect(btn.html()).toBeNull();
    props.ux.plan.isNew = true;
    btn.unmount();
  });

  it('matches snapshot', function() {
//    expect.snapshot(<Preview {...props} />).toMatchSnapshot();
  });

});
