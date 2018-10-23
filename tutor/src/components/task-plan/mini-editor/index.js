import PropTypes from 'prop-types';
import React from 'react';
import { Overlay, Popover } from 'react-bootstrap';
import classnames from 'classnames';
import LoadableItem from '../../loadable-item';
import { TaskPlanStore, TaskPlanActions } from '../../../flux/task-plan';
import Editor from './editor';

class TaskPlanMiniEditorShell extends React.Component {
  static propTypes = {
    courseId: PropTypes.string.isRequired,
    planId:   PropTypes.string.isRequired,
    onHide:   PropTypes.func.isRequired,
    findPopOverTarget: PropTypes.func.isRequired,

    position: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  };

  state = { isVisible: true };

  calculatePlacement = () => {
    // currently we use fixed positioning.
    // May adjust based on "position" prop at some point
    return 'top';
  };

  handleError = (error) => {
    return this.setState({ error });
  };

  renderEditor = () => {
    return (
      <Editor
        id={this.props.planId}
        onHide={this.props.onHide}
        courseId={this.props.courseId}
        termStart={this.props.termStart}
        termEnd={this.props.termEnd}
        save={TaskPlanActions.saveSilent}
        handleError={this.handleError} />
    );
  };

  render() {
    const { planId, courseId } = this.props;
    const popoverClasses = classnames('mini-task-editor-popover',
      { 'is-errored': this.state.error }
    );

    return (
      <div className="task-plan-mini-editor">
        <Overlay
          show={this.state.isVisible}
          onHide={this.props.onHide}
          placement={this.calculatePlacement()}
          ref="overlay"
          target={this.props.findPopOverTarget}>
          <Popover id="mini-task-editor-popover" className={popoverClasses}>
            <LoadableItem
              id={planId}
              store={TaskPlanStore}
              actions={TaskPlanActions}
              renderItem={this.renderEditor} />
          </Popover>
        </Overlay>
      </div>
    );
  }
}


export default TaskPlanMiniEditorShell;
