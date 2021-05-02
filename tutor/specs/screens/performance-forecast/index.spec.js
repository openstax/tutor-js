import { React } from '../../helpers';
import { Factory } from '../../helpers'
import Guide from '../../../src/screens/performance-forecast/guide';
import GUIDE_DATA from '../../../api/courses/1/guide.json';


describe('Learning Guide', function() {
    let props;

    beforeEach(function() {
        const course = Factory.course()
        course.performance.periods.replace([ GUIDE_DATA ])
        props = {
            course,
            performance: course.performance.periods[0],
            weakerTitle: 'weak',
            weakerExplanation: <p>this are weak sections</p>,
            weakerEmptyMessage: 'not enough worked',
        };
    });

    it('renders panel for each chapter', function() {
        expect.snapshot(<Guide {...props} />).toMatchSnapshot();
    });

});
