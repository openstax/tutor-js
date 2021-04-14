import { React, PropTypes, observer, observable, computed } from 'vendor';
import { get } from 'lodash';
import NotesSummaryToggle from '../notes/summary-toggle';
import { Course } from '../../models';
import MilestonesToggle from '../../screens/task/reading-milestones-toggle';

@observer
export default
class CenterControls extends React.Component {

    static propTypes = {
        course: PropTypes.instanceOf(Course),
    }

    @observable static currentTaskStep;

    @computed get course() {
        if (this.props.course) { return this.props.course; }

        return null;
    }

    @computed get shouldRender() {
        return get(this.task, 'isReading', false);
    }

    render() {
        if (!this.shouldRender) { return null; }

        const { taskStep } = this;

        return (
            <div className="center-control">
                <div className="icons">
                    <MilestonesToggle model={taskStep} />
                    <NotesSummaryToggle
                        course={this.course}
                        type="reading"
                        model={taskStep}
                    />
                </div>
            </div>
        );
    }
}
