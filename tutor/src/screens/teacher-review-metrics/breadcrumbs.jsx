import { React, PropTypes, observer, inject, styled, autobind, computed, action, idType } from '../../helpers/react';
import { map } from 'lodash';
import TutorBreadcrumb from '../../components/breadcrumb';
import BackButton from '../../components/buttons/back-button';
import { Stats } from '../../models/task-plans/teacher/stats';
import TeacherTaskPlan from '../../models/task-plans/teacher/plan';

const StyledBreadcrumbs = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 2rem;
`;

const Steps = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-weight: 600;
  margin: 0 2rem;
`;

@inject('setSecondaryTopControls')
@observer
class Breadcrumbs extends React.Component {

  static propTypes = {
    taskPlan: PropTypes.instanceOf(TeacherTaskPlan).isRequired,
    stats: PropTypes.instanceOf(Stats),
    courseId: idType.isRequired,
    currentStep: PropTypes.number,
    scrollToStep: PropTypes.func.isRequired,
    setSecondaryTopControls: PropTypes.func.isRequired,
    unDocked: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    if (!props.unDocked) {
      props.setSecondaryTopControls(this.renderBreadcrumbs);
    }
  }

  componentWillUnmount() {
    if (!this.props.unDocked) {
      this.props.setSecondaryTopControls(null);
    }
  }

  @action.bound goToStep(key) {
    this.props.scrollToStep(key);
  }

  @computed get crumbs() {
    if (!this.props.stats) { return []; }
    return map(this.props.stats.sections, s => ({
      type: this.props.taskPlan.type, sectionLabel: s, key: s,
    }));
  }

  // nothing is rendered directly, instead it's set in the secondaryToolbar
  render() {
    if (this.props.unDocked) {
      return this.renderBreadcrumbs();
    }
    return null;
  }

  @autobind renderBreadcrumbs() {
    const { currentStep, courseId, taskPlan } = this.props;

    const stepButtons = map(this.crumbs, crumb =>
      <TutorBreadcrumb
        step={crumb}
        stepIndex={crumb.key}
        currentStep={currentStep}
        goToStep={this.goToStep}
        key={`breadcrumb-${crumb.type}-${crumb.key}`} />
    );

    const fallbackLink = {
      to: 'viewTeacherDashboard',
      params: { courseId: courseId },
      text: 'Back to Calendar',
    };

    return (
      <StyledBreadcrumbs>
        <Steps>{stepButtons}</Steps>
        <Title>{taskPlan.title}</Title>
        <BackButton fallbackLink={fallbackLink} />
      </StyledBreadcrumbs>
    );
  }

}

export default Breadcrumbs;
