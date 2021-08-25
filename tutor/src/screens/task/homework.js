import {
    React, PropTypes, observer,
} from 'vendor';
import UX from './ux';
import ExerciseTaskHeader from './exercise-task-header';
import { TaskStep } from './step';

@observer
class HomeworkTask extends React.Component {

    static propTypes = {
        ux: PropTypes.instanceOf(UX).isRequired,
        windowImpl: PropTypes.object,
    }

    render() {
        const { ux, windowImpl } = this.props;

        return (
            <div className="homework-task">
                <ExerciseTaskHeader ux={ux} unDocked />
                <TaskStep
                    ux={ux}
                    step={ux.currentGroupedStep}
                    windowImpl={windowImpl}
                />
            </div>
        );
    }

}

export default HomeworkTask;
