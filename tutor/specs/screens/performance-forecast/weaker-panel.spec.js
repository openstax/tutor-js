import { Factory, React, ld } from '../../helpers';
import Weaker from '../../../src/screens/performance-forecast/weaker-panel';
import GUIDE_DATA from '../../../api/courses/1/guide.json';

describe('Weaker Section Panel', function() {
    let props;

    beforeEach(function() {
        const course = Factory.course()
        course.performance.periods.replace([ GUIDE_DATA ])
        const performance = course.performance.periods[0]
        props = {
            course,
            performance,
            weakerTitle: 'Weaker',
            weakerExplanation: 'Stuff you suck at',
            weakerEmptyMessage: 'Not enough data',
        };});

    it('displays the title', function() {
        const weaker = mount(<Weaker {...props} />);
        expect(weaker.text()).toContain(props.weakerTitle);
    });


    it('hides practice button if canPractice property is not given', function() {
        const weaker = mount(<Weaker {...props} />);
        expect(weaker).not.toHaveRendered('.practice.btn');
    });

    fit('does not render if there are no sections', function() {
        props.performance.children = [];
        const weaker = shallow(<Weaker {...props} />);
        expect(weaker.html()).toBeNull();
    });

    it('hides practice button if no sections are shown', function() {
        const section = ld.first(props.sections);
        props.sections = [section];
        section.is_real = false;
        const weaker = shallow(<Weaker {...props} />);
        expect(weaker).not.toHaveRendered('.practice.btn');
    });
});
