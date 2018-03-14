import React from 'react';
import {
  compact, trimEnd, includes, sortBy, find, filter, indexOf, clone, map, isEmpty, omit, last,
} from 'lodash';
import classnames from 'classnames';
import { Panel } from 'react-bootstrap';
import { observer } from 'mobx-react';
import ArbitraryHtmlAndMath from '../html';

import Question from '../question';
import ExerciseBadges from '../exercise-badges';
import ControlsOverlay from './controls-overlay';
import Exercise from '../../model/exercise';

@observer
class ExercisePreview extends React.Component {

  static propTypes = {
    exercise:        React.PropTypes.instanceOf(Exercise).isRequired,
    extractTag:      React.PropTypes.func,
    displayFeedback: React.PropTypes.bool,
    displayAllTags:  React.PropTypes.bool,
    displayFormats:  React.PropTypes.bool,
    panelStyle:      React.PropTypes.string,
    className:       React.PropTypes.string,
    header:          React.PropTypes.element,
    hideAnswers:     React.PropTypes.bool,
    onOverlayClick:  React.PropTypes.func,
    isSelected:      React.PropTypes.bool,
    isInteractive:   React.PropTypes.bool,
    overlayActions:  React.PropTypes.object,
    isVerticallyTruncated: React.PropTypes.bool,
  };

  static defaultProps = {
    panelStyle: 'default',
    isInteractive:   true,
    overlayActions:  {},
    extractTag(tag) {
      const content = compact([tag.name, tag.description]).join(' ') || tag.id;
      const isLO = includes(['lo', 'aplo'], tag.type);
      return (
        { content, isLO }
      );
    },
    sortTags(tags, extractTag) {
      tags = sortBy(tags, 'name');
      const idTag = find(tags, { type: 'id' });
      const loTag = find(tags, function(tag) {
        const { isLO } = extractTag(tag);
        return (
          isLO
        );
      });
      if (idTag) { tags.splice(indexOf(tags, idTag), 1); }
      if (loTag) { tags.splice(indexOf(tags, loTag), 0, idTag);
      } else { tags.push(idTag); }
      return (
        tags
      );
    },
  };

  get exercise() {
    return this.props.exercise;
  }

  renderTag = (tag) => {
    const { content, isLO } = this.props.extractTag(tag);
    const key = tag.id || tag.name;

    if (isLO) {
      return (
        <div key={key} className="lo-tag">
          {'LO: '}
          {content}
        </div>
      );
    } else {
      return (
        <span key={key} className="exercise-tag">
          {content}
        </span>
      );
    }
  };

  renderFooter = () => {
    console.log("RENDER CHILD")
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

  render() {
    let tags = this.props.exercise.tags.peek();
    if (!this.props.displayAllTags) {
      tags = filter(tags, { is_visible: true });
    }
    tags.push({ name: `ID: ${this.exercise.uid}`, type: 'id' });
    const renderedTags = map(this.props.sortTags(tags, this.props.extractTag), this.renderTag);
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

    const questions = map(this.exercise.questions, (question) => {
      if (this.props.hideAnswers) { question = omit(question, 'answers'); }

      return (
        <Question
          key={question.id}
          className="openstax-question-preview"
          question={question}
          choicesEnabled={false}
          displayFormats={this.props.displayFormats}
          show_all_feedback={this.props.displayFeedback}
          type="teacher-preview">
          {this.props.questionFooters != null ? this.props.questionFooters[questionIter] : undefined}
        </Question>
      );
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
          {questions}
        </div>
        <div className="exercise-tags">
          {renderedTags}
        </div>
      </Panel>
    );
  }
}

export default ExercisePreview;
