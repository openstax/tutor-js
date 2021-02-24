import { R, ld, Factory, TimeMock } from '../helpers';
import Stats from '../../src/screens/stats';
import StatsStore from '../../src/models/stats';

// apex charts calls textNode.getBBox which jsdom doesn't support
jest.mock('react-apexcharts', () => (
    (props) => JSON.stringify(props)
));

describe('Stats Screen', () => {
    let props;

    TimeMock.setTo('2019-10-30T12:00:00.000Z');

    beforeEach(() => {
        const stats = new StatsStore();
        window.scrollTo = jest.fn();
        stats.onLoaded({
            data: ld.times(20, () => Factory.bot.create('Stat')),
        });
        stats.api.requestCounts.read = 1;
        props = {
            stats,
        };
    });

    it('renders and matches snapshot', () => {
        expect(<R><Stats {...props} /></R>).toMatchSnapshot();
    });

});
