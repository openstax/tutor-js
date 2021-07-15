import { renderLateInfoPopover } from '../../src/components/task-progress';

describe('Task Progress', () => {
    describe('renderLateInfoPopover', () => {
        describe('incomplete task step', () => {
            const step = {
                is_completed: false,
                published_points: null,
            }

            it('does not render anything', () => {
                expect(renderLateInfoPopover(step)).toBeNull();
            });
        });

        describe('completed but ungraded task step', () => {
            const step = {
                is_completed: true,
                published_points: null,
            }

            it('renders the "Not yet graded" popup', () => {
                expect(renderLateInfoPopover(step)).toMatchSnapshot();
            });
        });
    });
});
