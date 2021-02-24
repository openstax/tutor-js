import BC from '../../../src/components/breadcrumb';

describe('Breadcrumb Component', function() {
    let props = null;

    beforeEach(() =>
        props = {
            goToStep: jest.fn(),

            step: {
                type: 'reading',
                is_completed: true,
                correct_answer_id: 1,
                task: { title: 'My Assignment' },
            },

            canReview: true,
            currentStep: 1,
            stepIndex: 2,

            crumb: {
                type: 'reading',
                labels: ['hot'],
            },
        });

    describe('Title', function() {
        it('indicates current step', function() {
            props.stepIndex = 1;
            props.step.is_completed = false;
            const bc = mount(<BC {...props} />);
            expect(bc.find('.openstax-breadcrumbs-step').props().title)
                .toEqual('Current Step (reading)');
        });

        it('indicates completed', function() {
            props.step.is_completed = true;
            const bc = mount(<BC {...props} />);
            //console.log(bc.debug())
            expect(bc.find('.openstax-breadcrumbs-step').props().title)
                .toEqual('Step Completed (reading). Click to review');
            bc.unmount();
        });

        it('shows end', function() {
            props.crumb.type = 'end';
            props.step.is_completed = true;
            const bc = mount(<BC {...props} />);
            expect(bc.find('.openstax-breadcrumbs-step').props().title)
                .toEqual('My Assignment Completion');
            bc.unmount();
        });
    });


    describe('Status', function() {
        it('can be correct', function() {
            props.canReview = true;
            props.step.is_correct = true;
            const bc = mount(<BC {...props} />);
            expect(bc).toHaveRendered('.icon-correct');
            bc.unmount();
        });
        it('can be incorrect', function() {
            props.canReview = true;
            props.step.answer_id = 11;
            const bc = mount(<BC {...props} />);
            expect(bc).toHaveRendered('.icon-incorrect');
            bc.unmount();
        });
        it('passes on data-label props', function() {
            props['data-label'] = 'This is a Label';
            const bc = mount(<BC {...props} />);
            //      console.log(bc.debug())
            expect(bc).toHaveRendered('.openstax-breadcrumbs-step[data-label="This is a Label"]');
            bc.unmount();
        });
    });

    it('calls onClick handler', () => {
        const bc = mount(<BC {...props} />);
        bc.simulate('click');
        expect(props.goToStep).toHaveBeenCalledWith(2, expect.anything());
        bc.unmount();
    });
});
