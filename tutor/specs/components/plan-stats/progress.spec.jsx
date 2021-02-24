import Progress from '../../../src/components/plan-stats/progress';

import { Page } from '../../../src/models/task-plans/teacher/stats';

describe('TaskPlan stats progress bar', function() {
    let props;

    beforeEach(() => {
        props = {
            type: 'reading',
            activeSection: '1.1',
            data: new Page({
                id: 1,
                chapter_section: [1,2],
                correct_count: 1,
                incorrect_count: 1,
            }),
        };
    });

    it('matches snapshot', function() {
        expect.snapshot(<Progress {...props} />).toMatchSnapshot();
    });

    it('renders as all incorrect', async () => {
        props.data.correct_count = 0;
        const wrapper = mount(<Progress {...props} />);
        expect(await axe(wrapper.html())).toHaveNoViolations();
        expect(wrapper).toHaveRendered('.reading-progress-bar[aria-valuenow=0]');
    });

});
