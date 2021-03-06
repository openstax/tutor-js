import { React, PropTypes, computed, observer, modelize, action, runInAction } from 'vendor';
import { currentExercises , currentCourses } from '../../models';
import Router from '../../helpers/router';
import Dashboard from './dashboard';
import Loading from 'shared/components/loading-animation';

import './styles.scss';

@observer
export default
class QuestionsDashboardShell extends React.Component {
    static propTypes = {
        exercises: PropTypes.object,
        history: PropTypes.shape({
            push: PropTypes.func,
        }).isRequired,
    }

    static defaultProps = {
        exercises: currentExercises,
    }

    constructor(props) {
        super(props);
        modelize(this);
    }

    @computed get course() {
        const { courseId } = Router.currentParams();
        return currentCourses.get(courseId);
    }

    @action componentDidMount() {
        this.props.exercises.clear();
        this.course.referenceBook.ensureLoaded();
    }

    componentWillUnmount() {
        runInAction(() => currentExercises.clear() )
    }

    render() {
        if (!this.course.referenceBook.api.hasBeenFetched) { return <Loading />; }
        return <Dashboard exercises={this.props.exercises} course={this.course} history={this.props.history} />;
    }
}
