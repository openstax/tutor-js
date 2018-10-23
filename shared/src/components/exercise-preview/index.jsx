import PropTypes from 'prop-types';
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
    exercise:        PropTypes.instanceOf(Exercise).isRequired,
    displayFeedback: PropTypes.bool,
    displayAllTags:  PropTypes.bool,
    displayFormats:  PropTypes.bool,
    displayNickname: PropTypes.bool,
    panelStyle:      PropTypes.string,
    className:       PropTypes.string,
    header:          PropTypes.element,
    hideAnswers:     PropTypes.bool,
    onOverlayClick:  PropTypes.func,
    isSelected:      PropTypes.bool,
    isInteractive:   PropTypes.bool,
    actionsOnSide:   PropTypes.bool,
    sortTags:        PropTypes.func,
    overlayActions:  PropTypes.object,
    extractedInfo:   PropTypes.object,
    isVerticallyTruncated: PropTypes.bool,
  };

  static defaultProps = {
    panelStyle: 'default',
    isInteractive:   true,
    overlayActions:  {},
    extractedInfo:   {},
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
    return trimEnd(last(this.exercise.questions).stem_html);
  };

  renderStimulus = () => {
    if (this.props.isInteractive || !this.props.extractedInfo.preview) {
      return (
        <ArbitraryHtmlAndMath
          className="stimulus"
          block={true}
          html={this.props.exercise.stimulus_html} />
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
      'has-interactive':  this.props.extractedInfo.hasInteractive,
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
          <ExerciseBadges flags={this.props.extractedInfo} />
          {!isEmpty(this.props.extractedInfo.context) && !!this.props.isInteractive ? <ArbitraryHtmlAndMath className="context" block={true} html={this.props.extractedInfo.context} /> : undefined}
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
