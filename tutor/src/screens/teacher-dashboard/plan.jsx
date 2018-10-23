import { React, observer, cn, action, mobxPropTypes } from '../../helpers/react';

import classnames from 'classnames';
import _ from 'underscore';
import PropTypes from 'prop-types';
import twix from 'twix';
import Course from '../../models/course';
import CoursePlanDetails from './plan-details';
import CoursePlanLabel from './plan-label';
import { CoursePlanDisplayEdit, CoursePlanDisplayQuickLook } from './plan-display';
import invariant from 'invariant';
import TaskPlanPublish from '../../models/jobs/task-plan-publish';

//  {PlanPublishStore, PlanPublishActions} = require '../../flux/plan-publish'
//import PlanHelper from '../../helpers/plan';
import Router from '../../helpers/router';
import TeacherTaskPlan from '../../models/task-plan/teacher';

// TODO drag and drop, and resize behavior

export default
@observer
class CoursePlan extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
    item: PropTypes.shape({
      plan: PropTypes.instanceOf(TeacherTaskPlan).isRequired,
      displays: mobxPropTypes.arrayOrObservableArrayOf(
        PropTypes.shape({
          rangeDuration: PropTypes.instanceOf(twix).isRequired,
          offset: PropTypes.number.isRequired,
          index: PropTypes.number.isRequired,
          offsetFromPlanStart: PropTypes.number.isRequired,
          order: PropTypes.number.isRequired,
          weekTopOffset: PropTypes.number.isRequired,
        }).isRequired
      ).isRequired,
    }),
    activeHeight: PropTypes.number,
    onShow: PropTypes.func,
    onHide: PropTypes.func,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    dateFormatted: PropTypes.string.isRequired,
  };

  static defaultProps = { activeHeight: 35 };

  getStateByProps = (props) => {
    if (props == null) { ((((({ props } = this))))); }

    const { item } = props;
    const { plan } = item;

    return {
      isViewingStats: this._doesPlanMatchesRoute(props),
      status: plan.publishedStatus,
      isPublishing: plan.isPublishing,
      isFailed: plan.isFailed,
      isHovered: false,
      isPublished: plan.isPublished,
    };
  };

  // utility functions for functions called in lifecycle methods
  _doesPlanMatchesRoute = (props) => {
    if (props == null) { ((((({ props } = this))))); }

    const { item } = props;
    const { plan } = item;

    const { planId } = this.props.currentPlan || Router.currentParams();
    return (
      planId === plan.id
    );
  };

  _getExpectedRoute = (isViewingStats) => {
    const closedRouteName = 'calendarByDate';
    const openedRouteName = 'calendarViewPlanStats';

    if (isViewingStats) { return openedRouteName; } else { return closedRouteName; }
  };

  _getExpectedParams = (isViewingStats) => {
    const planId = this.props.item.plan.id;

    const params = Router.currentParams();
    const closedParams = _.omit(params, 'planId');
    const openedParams = _.extend({}, params, { planId });

    if (isViewingStats) { return openedParams; } else { return closedParams; }
  };

  _updateRoute = (isViewingStats) => {
    const expectedRoute = this._getExpectedRoute(isViewingStats);
    const expectedParams = this._getExpectedParams(isViewingStats);
    const currentParams = Router.currentParams();
    if (!_.isEqual(currentParams, expectedParams)) {
      if (expectedParams.date == null) { expectedParams.date = this.context.dateFormatted; }
      this.context.router.history.push(Router.makePathname(expectedRoute, expectedParams));
    }
  };

  // handles when route changes and modal show/hide needs to sync
  // i.e. when using back or forward on browser
  syncRoute = () => {
    const isViewingStats = this._doesPlanMatchesRoute();
    this.setState({ isViewingStats });
  };

  // handles when plan is clicked directly and viewing state and route both need to update
  syncIsViewingStats = (isViewingStats) => {
    this._updateRoute(isViewingStats);
    this.setState({ isViewingStats });
  };

  componentWillMount() {
    const isViewingStats = this._doesPlanMatchesRoute();
    const state = _.extend({ isViewingStats });
    this.setState(state);
  }

  componentDidMount() {
    if(this.props.onShow) {
      this.props.onShow(this.props.item.plan);
    }
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.item.plan.id !== nextProps.item.plan.id) {
      const state = _.extend(this.getStateByProps(nextProps));
      this.setState(state);
    } else if (nextProps.item.plan.isPublishing && !this.props.item.plan.isPublishing) {
      this.subscribeToPublishing(nextProps.item.plan);
    } else {
      this.syncRoute();
    }
  }

  componentWillUnmount() {
    if (typeof this.props.onHide === 'function') {
      this.props.onHide(this.props.item.plan);
    }
  }

  setIsViewing = (isViewingStats) => {
    if (this.state.isViewingStats !== isViewingStats) {
      this.syncIsViewingStats(isViewingStats);
    }
  };

  setHover = (isHovered) => {
    if (this.state.isHovered !== isHovered) {
      this.setState({ isHovered });
    }
  };

  canQuickLook = () => {
    const { isPublished, isPublishing } = this.state;
    return Boolean(
      isPublished || isPublishing
    );
  };

  hasReview = () => {
    const { isPublished } = this.state;
    const { item } = this.props;
    const { plan } = item;

    return Boolean(
      isPublished && plan.isOpen && (plan.type !== 'event')
    );
  };

  buildPlanClasses = (plan, isActive) => {
    return (
      classnames('plan-label-long', `course-plan-${plan.id}`, {
        'is-published': plan.isPublished,
        'is-publishing': plan.isPublishing,
        'is-failed': plan.isFailed,
        'is-open': plan.isOpen,
        'is-new': plan.isNew,
        'is-trouble': plan.isTrouble,
        'active': isActive,
        [`is-${plan.publishedStatus}`]: plan.publishedStatus,
      }
      )
    );
  };

  renderDisplay = (hasQuickLook, hasReview, planClasses, display) => {
    const { rangeDuration, offset, offsetFromPlanStart, index } = display;
    const { item, course } = this.props;
    const { plan, displays } = item;

    const labelProps = { rangeDuration, plan, index, offset, offsetFromPlanStart };
    const label = <CoursePlanLabel {...labelProps} ref={`label${index}`} />;

    const DisplayComponent = hasQuickLook ?
      CoursePlanDisplayQuickLook
      :
      CoursePlanDisplayEdit;

    const displayComponentProps = {
      plan,
      display,
      label,
      course,
      planClasses,
      hasReview,
      isFirst: (index === 0),
      isLast: (index === (displays.length - 1)),
      setHover: this.setHover,
      setIsViewing: this.setIsViewing,
    };

    return (
      <DisplayComponent
        {...displayComponentProps}
        ref={`display${index}`}
        key={`display${index}`} />
    );
  };

  state = this.getStateByProps();

  render() {
    let planModal;
    const { item, course } = this.props;
    const { isPublishing, isPublished, isHovered, isFailed, isViewingStats } = this.state;
    const { plan, displays } = item;
    plan.publishing.reportObserved(); // let plan know that it's observed

    const hasReview = this.hasReview();
    let planClasses = this.buildPlanClasses(plan,
      isHovered || isViewingStats
    );

    if (isViewingStats) {
      let modalProps = {
        plan,
        course,
        className: planClasses,
        onHide: _.partial(this.syncIsViewingStats, false),
        ref: 'details',
        isPublished,
        isPublishing,
        isFailed,
        hasReview,
      };

      modalProps = _.defaults({}, modalProps, this.props);
      planModal = <CoursePlanDetails {...modalProps} />;
    }

    planClasses = `plan ${planClasses}`;
    const renderDisplay = _.partial(this.renderDisplay, this.canQuickLook(), hasReview, planClasses);
    const planDisplays = _.map(displays, renderDisplay);

    return (
      <div>
        {planDisplays}
        {planModal}
      </div>
    );
  }
};
