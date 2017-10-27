import { React, SnapShot } from '../helpers/component-testing';
import Progress from '../../../src/components/plan-stats/progress';

import { Page } from '../../../src/models/task-plan/stats';

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
    const component = SnapShot.create(<Progress {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders as all incorrect', () => {
    props.data.correct_count = 0;
    const progress = mount(<Progress {...props} />);
    expect(progress).toHaveRendered('.reading-progress-bar[aria-valuenow=0]');
  });

});
