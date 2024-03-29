import PropTypes from 'prop-types';
import React from 'react';
import {
    trimEnd, sortBy, map, isEmpty, last, filter,
} from 'lodash';
import { modelize } from 'modeled-mobx'
import classnames from 'classnames';
import { Card } from 'react-bootstrap';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import ArbitraryHtmlAndMath from '../html';
import Exercise, { Tag } from '../../model/exercise';
import Question from '../question';
import ExerciseBadges from '../exercise-badges';
import ControlsOverlay from './controls-overlay';

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
        children:        PropTypes.node,
        isVerticallyTruncated: PropTypes.bool,
        questionFooters: PropTypes.object,
        questionType:    PropTypes.string,
        disableMessage:  PropTypes.string,
        leftFooterRenderer: PropTypes.node,
        rightFooterRenderer: PropTypes.node,
    };

    static defaultProps = {
        panelStyle:      'default',
        questionType:    'teacher-preview',
        isInteractive:   true,
        overlayActions:  {},
        extractedInfo:   {},
    };

    constructor(props) {
        super(props);
        modelize(this);
    }

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
        return this.props.extractedInfo.preview ? this.props.extractedInfo.preview : trimEnd(last(this.exercise.questions).stem_html);
    };

    @computed get showPreview() {
        return Boolean(
            !this.props.isInteractive && this.props.extractedInfo.preview
        );
    }

    renderStimulus = () => {
        return (
            <ArbitraryHtmlAndMath
                block
                className="exercise stimulus"
                html={this.showPreview ? this.getCleanPreview() : this.props.exercise.stimulus_html}
            />
        );
    };

    renderOverlayActions = () => {
        if (this.props.disableMessage || !this.props.overlayActions) {
            return null;
        }

        return (
            <ControlsOverlay
                exercise={this.props.exercise}
                actions={this.props.overlayActions}
                onClick={this.props.onOverlayClick} />
        );
    }

    @computed get tags() {
        const { displayAllTags, displayNickname, exercise, hideAnswers } = this.props;
        let tags = exercise.tags.all.slice();
        if (!displayAllTags) { tags = filter(tags, 'isImportant'); }
        tags = sortBy(tags, 'sortValue', 'title');
        if (!hideAnswers && this.props.exercise.solutions_are_public) {
            tags.push(new Tag('solution is public'));
        }
        if (displayNickname && exercise.nickname) {
            tags.push(new Tag(`Nickname:${exercise.nickname}`));
        }
        tags.push(new Tag(`ID:${exercise.uid}`));
        return tags;
    }

    render() {
        const info = this.props.extractedInfo;

        const classes = classnames( 'openstax-exercise-preview', this.props.className, {
            'answers-hidden':   this.props.hideAnswers,
            'has-actions':      !isEmpty(this.props.overlayActions),
            'is-selected':      this.props.isSelected,
            'actions-on-side':  this.props.actionsOnSide,
            'non-interactive':  this.props.isInteractive === false,
            'is-vertically-truncated': this.props.isVerticallyTruncated,
            'is-displaying-formats':   this.props.displayFormats,
            'is-displaying-feedback':  this.props.displayFeedback,
            'has-interactive':  info.hasInteractive,
        });
        return (
            <Card
                className={classes}
                data-exercise-id={this.props.exercise.uid}
                tabIndex={-1}
            >
                {this.props.header && <Card.Header>{this.props.header}</Card.Header>}
                <Card.Body>
                    {this.props.isSelected && <div className="selected-mask" />}
                    {this.props.isSelected && this.props.questionType === 'student-mpp' && (
                        <div className="selected-student-mpp-check" />)}
                    {this.props.disableMessage && (
                        <div className="disabled-message">
                            <p>{this.props.disableMessage}</p>
                        </div> )}
                    {this.renderOverlayActions()}
                    <div className="exercise-body">
                        <ExerciseBadges
                            multiPart={info.isMultiPart}
                            video={info.hasVideo}
                            interactive={info.hasInteractive}
                            writtenResponse={info.isWrittenResponse}
                            questionType={this.props.questionType}
                        />
                        {!isEmpty(info.context) && !!this.props.isInteractive ? <ArbitraryHtmlAndMath className="context" block={true} html={info.context} /> : undefined}
                        {this.renderStimulus()}
                        {map(this.exercise.questions, (question, index) => (
                            <div key={index}>
                                <Question
                                    hideAnswers={this.props.hideAnswers}
                                    className="openstax-question-preview"
                                    question={question}
                                    choicesEnabled={false}
                                    hidePreambles={this.showPreview}
                                    displayFormats={this.props.displayFormats}
                                    show_all_feedback={this.props.displayFeedback}
                                    type={this.props.questionType}
                                >
                                    {this.props.questionFooters && this.props.questionFooters[index]}
                                </Question>
                                {
                                    question.isWrittenResponse && (
                                        <div className="student-free-response-box-preview">
                                            Student Response...
                                        </div>
                                    )
                                }
                            </div>
                        ))}
                    </div>
                    <div className="exercise-footer">
                        <div>
                            {
                                this.props.questionType !== 'student-mpp' &&
                                    <div className="exercise-tags">
                                        {map(this.tags, (tag, index) => (
                                            <span key={index} className="exercise-tag" data-test-id={`tag-type-${tag.type}`}>
                                                {tag.title}
                                            </span>
                                        ))}
                                    </div>
                            }
                            {this.props.leftFooterRenderer}
                        </div>
                        <div>
                            {this.props.rightFooterRenderer}
                        </div>
                    </div>
                </Card.Body>
                {this.props.children && <Card.Footer>{this.renderFooter()}</Card.Footer>}
            </Card>
        );
    }
}


export default ExercisePreview;
