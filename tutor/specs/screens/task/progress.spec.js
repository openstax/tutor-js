import UX from '../../../src/screens/task/ux';
import Progress from '../../../src/screens/task/progress';

import { Factory } from '../../helpers';

describe('Reading Progress Component', () => {
  let props;

  beforeEach(() => {
    const task = Factory.studentTasks({
      count: 1,
      attributes: { type: 'reading', stepCount: 2 },
    }).array[0];
    props = {
      ux: new UX({ task }),
    };
  });

  it('matches snapshot', () => {
    expect(<Progress {...props}><p>hi</p></Progress>).toMatchSnapshot();
  });

  it('pages through steps', () => {
    const pr = mount(<Progress {...props}><p>hi</p></Progress>);
    expect(pr).toHaveRendered('a.paging-control.prev[disabled=true]');
    expect(pr).toHaveRendered('a.paging-control.next[disabled=false]');
    pr.find('a.paging-control.next').simulate('click');
    expect(pr).toHaveRendered('a.paging-control.next[disabled=true]');
    expect(pr).toHaveRendered('a.paging-control.prev[disabled=false]');
    expect(props.ux.stepIndex).toEqual(1);
    pr.unmount();
  });

});
