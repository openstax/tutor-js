import Interactive from '../../../../src/screens/task/step/interactive';
import { Factory, TestRouter } from '../../../helpers';
import UX from '../../../../src/screens/task/ux';

jest.mock('../../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('Reading Tasks Screen', () => {
  let props;

  beforeEach(() => {
    const task = Factory.studentTask({ type: 'reading', steps: [{ type: 'interactive' }] });
    const ux = new UX({
      task,
      course: Factory.course(),
      router: new TestRouter(),
    });
    props = {
      ux,
      step: task.steps[0],
    };
  });

  it('matches snapshot', () => {
    expect.snapshot(<Interactive {...props} />).toMatchSnapshot();
  });

  it('renders html', () => {
    props.step.content.content_html = '<p>testing text</p>';
    const ia = mount(<Interactive {...props} />);
    expect(ia.text()).toContain('testing text');
    ia.unmount();
  });

});
