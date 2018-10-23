import PropTypes from 'prop-types';
import React from 'react';
import BS from 'react-bootstrap';
import { Task } from './index';
import Router from '../../helpers/router';
import LoadableItem from '../loadable-item';
import { TaskActions, TaskStore } from '../../flux/task';
import { CoursePracticeActions, CoursePracticeStore } from '../../flux/practice';
import InvalidPage from '../invalid-page';
import Icon from '../icon';

class PracticeTask extends React.Component {
  static propTypes = {
    courseId: PropTypes.string.isRequired,
    taskId:   PropTypes.string.isRequired,
  };

  render() {
    return (
      <LoadableItem
        id={this.props.taskId}
        store={TaskStore}
        actions={TaskActions}
        renderItem={() => <Task id={this.props.taskId} />} />
    );
  }
}

class LoadPractice extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    courseId: PropTypes.string.isRequired,
  };

  componentDidMount() {
    CoursePracticeStore.on(`loaded.${this.props.courseId}`, this.onPracticeLoad);
    return CoursePracticeActions.create({ courseId: this.props.courseId, query: Router.currentQuery() });
  }

  componentWillUnmount() {
    return CoursePracticeStore.off(`loaded.${this.props.courseId}`, this.onPracticeLoad);
  }

  onPracticeLoad = (taskId) => {
    return this.context.router.history.push(
      Router.makePathname('practiceTopics', { taskId, courseId: this.props.courseId })
    );
  };

  render() {
    return (
      <h1>
        <Icon type="spinner" spin={true} />
        {' Retrieving practice exercises…'}
      </h1>
    );
  }
}

class PracticeTaskShell extends React.Component {
  render() {
    const { params, query } = Router.currentState();
    if (query.page_ids || query.worst) {
      return <LoadPractice courseId={params.courseId} sectionIds={query.page_ids} />;
    } else if (params.taskId) {
      return <PracticeTask courseId={params.courseId} taskId={params.taskId} />;
    } else {
      return <InvalidPage />;
    }
  }
}

export default PracticeTaskShell;
