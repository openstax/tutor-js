import {
    React, PropTypes, observer, observable, computed, idType, modelize, runInAction,
} from 'vendor';
import { Redirect } from 'react-router-dom';
import Router from '../../helpers/router';
import { currentCourses, Course } from '../../models';
import { BulletList as PendingLoad } from 'react-content-loader';
import { CourseNotFoundWarning } from '../../components/course-not-found-warning';
import { StepCard } from './step/card';


@observer
export default class TaskPractice extends React.Component {
    static propTypes = {
        params: PropTypes.shape({
            courseId: idType.isRequired,
        }).isRequired,
        course: PropTypes.instanceOf(Course),
    }

    constructor(props) {
        super(props);
        modelize(this);
    }

    @computed get course() {
        return this.props.course || currentCourses.get(this.props.params.courseId);
    }

    @observable taskId;

    async componentDidMount() {
        if (!this.course) { return; }
        const { id } = await this.course.studentTasks.practice(Router.currentQuery())
        runInAction(() => this.taskId = id )
    }

    render() {
        if (!this.course) {
            return <CourseNotFoundWarning areaName="assignment" messageType="notAllowed" />;
        }

        if (!this.taskId) {
            return (
                <StepCard><PendingLoad /></StepCard>
            );
        }

        return <Redirect to={Router.makePathname('viewTask', {
            id: this.taskId,
            courseId: this.course.id,
        })} />;

    }
}
