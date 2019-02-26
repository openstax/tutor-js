import { C } from '../../helpers';
import { EventTask } from '../../../src/components/task/event';

describe('TaskEvent', function() {
  it('renders and matches snapshot', function() {
    expect.snapshot(<C noRef><EventTask courseId={1} task={{
      title: 'Test',
      description: 'A long description is shown',
    }} /></C>).toMatchSnapshot();
  });
});
