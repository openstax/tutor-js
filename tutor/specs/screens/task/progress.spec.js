import UX from '../../../src/screens/task/ux';
import Progress from '../../../src/screens/task/progress';
import { Factory, TimeMock, TestRouter } from '../../helpers';

describe('Reading Progress Component', () => {
  let props;
  TimeMock.setTo('2017-10-14T12:00:00.000Z');

  beforeEach(() => {
    const task = Factory.studentTasks({
      count: 1,
      attributes: { type: 'reading', steps: [
        { type: 'reading' }, { type: 'reading' },
      ] },
    }).array[0];
    props = {
      ux: new UX({ task, history: new TestRouter().history }),
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
    pr.find('a.paging-control.next').simulate('click');
    expect(pr).toHaveRendered('a.paging-control.next[disabled=true]');
    expect(pr).toHaveRendered('a.paging-control.prev[disabled=false]');
    pr.unmount();
  });

});
