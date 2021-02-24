import UX from '../../../src/screens/task/ux';
import Progress from '../../../src/screens/task/progress';
import { TestRouter, Factory, TimeMock, ld } from '../../helpers';

describe('Reading Progress Component', () => {
    let props;
    let history;
    TimeMock.setTo('2017-10-14T12:00:00.000Z');

    beforeEach(() => {
        const task = Factory.studentTasks({
            count: 1,
            attributes: { type: 'reading', steps: [
                { type: 'reading' }, { type: 'reading' },
            ] },
        }).array[0];
        props = {
            ux: new UX({ task, history }),
        };
        history = new TestRouter({
            push: (url) => {
                props.ux.goToStep(ld.last(url.split('/')), false);
            },
        }).history;
    });

    it('matches snapshot', () => {
        expect(<Progress {...props}><p>hi</p></Progress>).toMatchSnapshot();
    });

});
