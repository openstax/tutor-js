import { React, Factory } from '../../helpers';
import { DeleteModal } from '../../../src/screens/grading-templates/modals';

describe('Delete Modal', function() {
    let props;

    beforeEach(() => {
        props = {
            template: Factory.gradingTemplate({ task_plan_type: 'reading' }),
            onDelete: jest.fn(),
            onCancel: jest.fn(),
        };
    });

    it('matches snapshot', () => {
        expect(<DeleteModal {...props} />).toMatchSnapshot();
    });

    it('deletes and cancels', () => {
        const modal = shallow(<DeleteModal {...props} />);

        modal.find('.cancel').simulate('click');
        expect(props.onCancel).toHaveBeenCalled();

        modal.find('.delete').simulate('click');
        expect(props.onDelete).toHaveBeenCalledWith(props.template);
    });
});
