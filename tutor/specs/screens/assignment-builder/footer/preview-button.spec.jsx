import { Factory } from '../../../helpers';
import Preview from '../../../../src/screens/assignment-builder/footer/preview-button';

describe('Task Plan Builder: Preview button', () => {

  let props;
  beforeEach(() => {
    props = {
      ux: {
        plan: { type: 'reading' },
        course: Factory.course({
          appearance_code: 'college_biology',
        }),
      },
    };
  });

  it('renders when plan hw or reading', () => {
    const btn = shallow(<Preview {...props} />);
    expect(btn.html()).not.toBeNull();
    props.ux.plan.type = 'external';
    btn.setProps({ ux: { ...props.ux } });
    expect(btn.html()).toBeNull();
    btn.unmount();
  });

  it('matches snapshot', function() {
    expect.snapshot(<Preview {...props} />).toMatchSnapshot();
  });

});
