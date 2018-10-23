import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import { HomeworkPlan } from './homework';
import { ReadingPlan } from './reading';
import { ExternalPlan } from './external';
import { EventPlan } from './event';
import LoadableItem from '../loadable-item';

import { TaskPlanStore, TaskPlanActions } from '../../flux/task-plan';
import Router from '../../helpers/router';
import TourRegion from '../tours/region';

import { ScrollToMixin } from 'shared';

const PLAN_TYPES = {
  reading: ReadingPlan,
  homework: HomeworkPlan,
  external: ExternalPlan,
  event: EventPlan,
};

const getPlanType = function(typeName) {
  let type;
  return type = PLAN_TYPES[typeName];
};

class HomeworkShell extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  static displayName = 'HomeworkShell';

  render() {
    const { courseId, id } = Router.currentParams();
    return <PlanShell courseId={courseId} id={id} type="homework" />;
  }
}

class ReadingShell extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  static displayName = 'ReadingShell';

  render() {
    const { courseId, id } = Router.currentParams();
    return <PlanShell courseId={courseId} id={id} type="reading" />;
  }
}

class ExternalShell extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  static displayName = 'ExternalShell';

  render() {
    const { courseId, id } = Router.currentParams();
    return <PlanShell courseId={courseId} id={id} type="external" />;
  }
}

class EventShell extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  static displayName = 'EventShell';

  render() {
    const { courseId, id } = Router.currentParams();
    return <PlanShell courseId={courseId} id={id} type="event" />;
  }
}

const PlanBuilder = ({ id, courseId, body: Body, type }) =>
  <TourRegion
    id={`${type}-assignment-editor`}
    otherTours={[`${type}-assignment-editor-super`]}
    courseId={courseId}>
    <Body id={id} courseId={courseId} />
  </TourRegion>
;


var PlanShell = createReactClass({
  displayName: 'PlanShell',
  mixins: [ScrollToMixin],

  contextTypes: {
    router: PropTypes.object,
  },

  componentDidMount() { return this.scrollToTop(); },

  getInitialState() {
    let { id } = Router.currentParams();
    const { type } = this.props;
    if (!getPlanType(type)) {
      this.context.router.history.push(Router.makePathname('NotFoundRoute'));
      return;
    }

    if (!id || (id === 'new')) {
      id = TaskPlanStore.freshLocalId();
      TaskPlanActions.create(id, { type });
    }

    return { id };
  },

  getId() { return this.state.id || Router.currentParams().id; },

  getType() {
    const typeName = this.props.type;
    return getPlanType(typeName);
  },

  render() {
    const { courseId } = Router.currentParams();
    const id = this.getId();

    if (TaskPlanStore.isDeleteRequested(id)) {
      return <Type id={id} courseId={courseId} />;
    }

    return (
      <LoadableItem
        id={id}
        store={TaskPlanStore}
        actions={TaskPlanActions}
        renderItem={() => {
          return <PlanBuilder type={this.props.type} body={this.getType()} id={id} courseId={courseId} />;
        }} />
    );
  },
});

export { ReadingShell, HomeworkShell, ExternalShell, EventShell };
