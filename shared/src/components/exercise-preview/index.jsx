import React from 'react';
import {
  compact, trimEnd, includes, sortBy, find, filter, indexOf, map, isEmpty, omit, last,
} from 'lodash';
import classnames from 'classnames';
import { Panel } from 'react-bootstrap';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import ArbitraryHtmlAndMath from '../html';
import Tag from '../../model/exercise/tag';
import Question from '../question';
import ExerciseBadges from '../exercise-badges';
import ControlsOverlay from './controls-overlay';
import Exercise from '../../model/exercise';

@observer
class ExercisePreview extends React.Component {

  static propTypes = {
    exercise:        React.PropTypes.instanceOf(Exercise).isRequired,
    displayFeedback: React.PropTypes.bool,
    displayAllTags:  React.PropTypes.bool,
    displayFormats:  React.PropTypes.bool,
    displayNickname: React.PropTypes.bool,
    panelStyle:      React.PropTypes.string,
    className:       React.PropTypes.string,
    header:          React.PropTypes.element,
    hideAnswers:     React.PropTypes.bool,
    onOverlayClick:  React.PropTypes.func,
    isSelected:      React.PropTypes.bool,
    isInteractive:   React.PropTypes.bool,
    actionsOnSide:   React.PropTypes.bool,
    sortTags:        React.PropTypes.func,
    overlayActions:  React.PropTypes.object,
    isVerticallyTruncated: React.PropTypes.bool,
  };

  static defaultProps = {
    panelStyle: 'default',
    isInteractive:   true,
    overlayActions:  {},

  };

  get exercise() {
    return this.props.exercise;
  }

  renderFooter = () => {
    return (
      <div className="controls">
        {this.props.children}
      </div>
    );
  };

  getCleanPreview = () => {
    return trimEnd(last(this.exercise.questions).question.stem_html);
  };

  renderStimulus = () => {
    if (this.props.isInteractive || !this.exercise.preview) {
      return (
        <ArbitraryHtmlAndMath
          className="stimulus"
          block={true}
          html={this.exercise.stimulus_html} />
      );
    } else {
      return (
        <ArbitraryHtmlAndMath className="stimulus" block={true} html={this.getCleanPreview()} />
      );
    }
  };

  @computed get tags() {
    const { displayAllTags, displayNickname, exercise } = this.props;
    let tags = exercise.tags.slice();
    if (!displayAllTags) { tags = filter(tags, 'isImportant'); }
    tags = sortBy(tags, tag => tag.isLO);
    if (displayNickname && exercise.nickname) {
      tags.push(new Tag(`Nickname:${exercise.nickname}`));
    }
    tags.push(new Tag(`ID:${exercise.uid}`));

    return tags;
  }

  render() {
    const classes = classnames( 'openstax-exercise-preview', this.props.className, {
      'answers-hidden':   this.props.hideAnswers,
      'has-actions':      !isEmpty(this.props.overlayActions),
      'is-selected':      this.props.isSelected,
      'actions-on-side':  this.props.actionsOnSide,
      'non-interactive':  this.props.isInteractive === false,
      'is-vertically-truncated': this.props.isVerticallyTruncated,
      'is-displaying-formats':   this.props.displayFormats,
      'is-displaying-feedback':  this.props.displayFeedback,
      'has-interactive':  this.props.exercise.has_interactive,
    });

    return (
      <Panel
        className={classes}
        bsStyle={this.props.panelStyle}
        header={this.props.header}
        data-exercise-id={this.props.exercise.uid}
        tabIndex={-1}
        footer={this.props.children ? this.renderFooter() : undefined}>
        {this.props.isSelected ? <div className="selected-mask" /> : undefined}
        <ControlsOverlay
          exercise={this.props.exercise}
          actions={this.props.overlayActions}
          onClick={this.props.onOverlayClick} />
        <div className="exercise-body">
          <ExerciseBadges exercise={this.props.exercise} />
          {!isEmpty(this.props.exercise.context) && !!this.props.isInteractive ? <ArbitraryHtmlAndMath className="context" block={true} html={this.props.exercise.context} /> : undefined}
          {this.renderStimulus()}
          {map(this.exercise.questions, (question, index) => (
            <Question
              key={index}
              hideAnswers={this.props.hideAnswers}
              className="openstax-question-preview"
              question={question}
              choicesEnabled={false}
              displayFormats={this.props.displayFormats}
              show_all_feedback={this.props.displayFeedback}
              type="teacher-preview">
              {this.props.questionFooters != null ? this.props.questionFooters[questionIter] : undefined}
            </Question>
          ))}
        </div>
        <div className="exercise-tags">
          {map(this.tags, (tag, index) => (
            <span key={index} className="exercise-tag">
              {tag.asString}
            </span>
          ))}
        </div>
      </Panel>
    );
  }
}

export default ExercisePreview;
