import { Factory, React } from '../../helpers';
import Weaker from '../../../src/screens/performance-forecast/weaker-sections';
import GUIDE_DATA from '../../../api/courses/1/guide.json';

describe('Weaker Sections listing', function() {
    let props;

    beforeEach(function() {
        const course = Factory.course()
        course.performance.periods.replace([ GUIDE_DATA ])
        const performance = course.performance.periods[0]
        return props = {
            course,
            performance,
            weakerEmptyMessage: 'Not enough data',
        };});

    it('renders forecast bars', function() {
        const weaker = mount(<Weaker {...props} />);
        expect(weaker).toHaveRendered('PerformanceForecastProgressBar');
    });

});
