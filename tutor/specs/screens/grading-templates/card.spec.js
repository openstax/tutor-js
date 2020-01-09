import { React, Factory } from '../../helpers';
import Card from '../../../src/screens/grading-templates/card';

describe('Grading Templates Card', function() {
  let props;

  beforeEach(() => {
    props={
      template: Factory.gradingTemplate({ task_plan_type: 'reading' }),
      onEdit: jest.fn(),
      onDelete: jest.fn(),
    };
  });

  it('matches snapshot for reading', () => {
    expect.snapshot(<Card {...props} />).toMatchSnapshot();
  });

  it('matches snapshot for homework', () => {
    props.template = Factory.gradingTemplate({ task_plan_type: 'homework' });
    expect.snapshot(<Card {...props} />).toMatchSnapshot();
  });

  it('deletes and edits', () => {
    const card = mount(<Card {...props} />);
    // cant delete unless there is a matching template
    expect(card.find('button.ox-icon-trash')).toHaveLength(0);
    props.template.map = {
      array: { find() { return props.template; } },
    };
    expect(props.template.canRemove).toBe(true);
    card.update();
    card.find('button.ox-icon-trash').simulate('click');
    expect(props.onDelete).toHaveBeenCalledWith(props.template);

    card.find('button.ox-icon-edit').simulate('click');
    expect(props.onEdit).toHaveBeenCalledWith(props.template);
  });
});
