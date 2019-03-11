import { Task } from '../../../src/screens/task/index';
import { Factory } from '../../helpers';


describe('Tasks Screen', () => {
  let props;

  beforeEach(() => {
    props = {
      course: Factory.course(),
    };
  });

  it('renders', () => {
    mount(<Task {...props} />);
    //expect.snapshot(<Task {...props} />).toMatchSnapshot();

  });

});
