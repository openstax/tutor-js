import { React, PropTypes, withRouter, observer, styled } from 'vendor';
import { ScrollToTop } from 'shared';
import LoadingScreen from 'shared/components/loading-animation';
import TutorLink from '../../components/link';
import UX from './ux';
import QuestionsBar from './questions-bar';
import Question from './question';
import { currentCourses } from '../../models';
import CourseBreadcrumb from '../../components/course-breadcrumb';
import { BackgroundWrapper } from '../../helpers/background-wrapper';
import CoursePeriodSelect from '../../components/course-period-select';
import { colors } from 'theme';
import './styles.scss';

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const BodyBackground = styled.div`
  padding: 4rem;
  background-color: ${colors.neutral.bright};
`;

@withRouter
@observer
class AssignmentGrading extends React.Component {

    static displayName = 'AssignmentGrading';

    static propTypes = {
        params: PropTypes.shape({
            id: PropTypes.string,
            courseId: PropTypes.string.isRequired,
            periodId: PropTypes.string,
            questionId: PropTypes.string,
        }),
        course: PropTypes.object,
        history: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);

        this.ux = new UX();
        this.ux.initialize({
            ...props.params,
            course: props.course || currentCourses.get(props.params.courseId),
            history: props.history,
            onComplete: this.onComplete,
        });
    }

    renderEmpty(courseId) {
        return (<>
            <h2>No activity yet</h2>
            <p>
        No students enrolled.
        Manage student enrollment in <TutorLink to="courseRoster" params={{ courseId }}>Course roster</TutorLink>.
            </p>
        </>);
    }

    renderContent(ux) {
        return (
            <>
                <QuestionsBar ux={ux} />
                <BodyBackground>
                    <Question
                        ux={ux}
                    />
                </BodyBackground>
            </>
        );
    }

    render() {
        const { ux } = this;

        if (!ux.isExercisesReady) {
            return <LoadingScreen message="Loading Assignment…" />;
        }
        return (
            <BackgroundWrapper>
                <ScrollToTop>
                    <Heading>
                        <CourseBreadcrumb
                            course={ux.course}
                            plan={{
                                title: ux.planScores.title,
                                id: ux.planScores.id,
                            }}
                            currentTitle="Grade Answers"
                        />
                        <CoursePeriodSelect
                            period={ux.selectedPeriod}
                            periods={ux.assignedPeriods}
                            course={ux.course}
                            onChange={ux.setSelectedPeriod}
                        />
                    </Heading>
                    { ux.headings.length === 0 ? this.renderEmpty(ux.course.id) : this.renderContent(ux) }  
                </ScrollToTop>
            </BackgroundWrapper>
        );

    }
}


export default AssignmentGrading;
