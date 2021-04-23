import { Factory,React, R } from '../../helpers';
import Button from '../../../src/screens/performance-forecast/practice-button';
import GUIDE_DATA from '../../../api/courses/1/guide.json';

describe('Learning Guide Practice Button', function() {
    let props;

    beforeEach(() => {
        const course = Factory.course()
        course.performance.periods.replace([ GUIDE_DATA ])
        const performance = course.performance.periods[0]
        props = {
            course,
            performance,
            title: 'Practice moar',
            section: performance.children[0].children[0],
        }
    });

    it('can be rendered and sets the name', () => {
        const button = mount(<R><Button {...props} /></R>);
        expect(button.text()).toEqual('Practice moar');
    });

});
