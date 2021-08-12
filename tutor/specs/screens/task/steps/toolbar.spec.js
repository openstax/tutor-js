import { StepToolbar } from '../../../../src/screens/task/step/toolbar';
import { Factory, TimeMock, C } from '../../../helpers';

describe('Task Step Toolbar', () => {
    let props;
    TimeMock.setTo('2017-10-14T12:00:00.000Z');

    beforeEach(() => {
        const task = Factory.studentTask({ type: 'homework', stepCount: 1 });
        props = {
            course: Factory.course(), step: task.steps[0],
        };
    });

    it('matches snapshot', () => {
        const bar = mount(<C><StepToolbar {...props} /></C>);
        expect(bar.debug()).toMatchSnapshot();
        bar.unmount();
    });

    it('hides the toolbar', () => {
      const bar = mount(<C><StepToolbar hideToolbar={true} {...props} /></C>);
      expect(bar).toEqual({});
      bar.unmount();
    });

    it('hides save to practice button', () => {
      const bar = mount(<C><StepToolbar showSaveToPractice={false} {...props} /></C>);
      expect(bar).not.toHaveRendered('SavePracticeButton');
      bar.unmount();
    });

    it('hides content link', () => {
      const bar = mount(<C><StepToolbar hideContentLink={true} {...props} /></C>);
      expect(bar).not.toHaveRendered('BrowseTheBook');
      bar.unmount();
    });
});
