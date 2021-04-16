import { React, PropTypes, observer, modelize } from 'vendor'
import { isEmpty } from 'lodash';
import { autobind } from 'core-decorators';
import ExerciseCard from './exercise-card';
import Loading from 'shared/components/loading-animation';
import UX from './ux';

@observer
export default
class Exercises extends React.Component {
    static propTypes = {
        ux: PropTypes.instanceOf(UX).isRequired,
    };

    constructor(props) {
        super(props);
        modelize(this);
    }

    @autobind renderExercise(exercise) {
        return (
            <ExerciseCard key={exercise.id} exercise={exercise} ux={this.props.ux} />
        );
    }

    render() {
        const { ux } = this.props;
        if (ux.isFetchingExercises) {
            return <Loading message="Fetching Exercises…" />;
        }

        if (isEmpty(ux.exercises)) { return <h1>No exercises found</h1>; }

        return (
            <div className="exercises">
                {ux.exercises.map(this.renderExercise)}
            </div>
        );
    }
}
