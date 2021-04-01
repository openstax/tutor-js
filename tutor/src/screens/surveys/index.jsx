import PropTypes from 'prop-types';
import React from 'react';
import { Survey, Model } from 'survey-react';
import { computed, action, modelize } from 'shared/model'
import { Card } from 'react-bootstrap';
import Router from '../../helpers/router';
import { observer } from 'mobx-react';
import Courses from '../../models/courses-map';
import Course from '../../models/course';
import { idType } from 'shared';
import LoadingScreen from 'shared/components/loading-animation';
import NotFound from '../../components/invalid-page';
import CoursePage from '../../components/course-page';
import BackButton from '../../components/buttons/back-button';
import './styles.scss';

const ThankYou = () => {
    const params = Router.currentParams();
    const backLink = params.courseId ? { to: 'dashboard', text: 'Back to Dashboard', params } :
        { to: 'myCourses', text: 'Back to My Courses' };

    return (
        <Card>
            <h3>Thank you for completing the survey!</h3>
            <p>
                <BackButton fallbackLink={backLink} />
            </p>
        </Card>
    );
};


@observer
export default
class Surveys extends React.Component {
    static propTypes = {
        course: PropTypes.instanceOf(Course),
        params: PropTypes.shape({
            courseId: idType,
            surveyId: idType,
        }).isRequired,
    }

    constructor(props) {
        super(props);
        modelize(this);
    }

    UNSAFE_componentWillMount() {
        if (!this.studentTaskPlans.api.isFetchedOrFetching) {
            this.studentTaskPlans.fetch();
        }
    }

    @computed get course() {
        return this.props.course || Courses.get(this.props.params.courseId);
    }

    @computed get studentTaskPlans() {
        return this.course.studentTaskPlans;
    }

    @computed get survey() {
        return this.studentTaskPlans.researchSurveys ?
            this.studentTaskPlans.researchSurveys.get(this.props.params.surveyId) : null;
    }

    @computed get model() {
        return this.survey ? new Model(this.survey.surveyJS) : null;
    }

    @action.bound onComplete(survey) {
        this.survey.response = survey.data;
        this.survey.save();
    }

    render() {
        const { course, model, survey } = this;
        if (!survey) {
            return this.studentTaskPlans.api.isPending ?
                <LoadingScreen /> : <NotFound />;
        }
        if (survey.api.isPending) {
            return <LoadingScreen message="Saving response…" />;
        }
        if (survey.isComplete) {
            return <ThankYou survey={survey} />;
        }

        return (
            <CoursePage
                className="research-surveys"
                title={course.name}
                subtitle={course.termFull}
                course={course}
            >
                <h3>{survey.title}</h3>
                <Survey model={model} onComplete={this.onComplete} />
            </CoursePage>
        );
    }
}
