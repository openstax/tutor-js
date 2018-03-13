import React from 'react';
import _ from 'underscore';
import Exercise from '../../helpers/exercise';
import Interactive from './interactive-icon';
import MultiPart from './multipart-icon';
import classnames from 'classnames';

export default class ExerciseBadges extends React.PureComponent {

  static propTypes = {
    isMultipart:    React.PropTypes.bool,
    hasInteractive: React.PropTypes.bool,
    hasVideo:       React.PropTypes.bool,
    exercise:       React.PropTypes.object,
    className:      React.PropTypes.string,
  }

  static defaultProps = {
    isMultipart: false,
    hasInteractive: false,
    hasVideo: false,
    exercise: {},
  }

  render() {
    const classes = classnames('openstax-exercise-badges', this.props.className);
    const badges = [];
    if (this.props.isMultipart || Exercise.isMultipart(this.props.exercise)) {
      badges.push(<span key="mpq" className="mpq">
        <MultiPart />
        <span>
          Multi-part question
        </span>
      </span>
      );
    }

    if (this.props.hasInteractive || Exercise.hasInteractive(this.props.exercise)) {
      badges.push(<span key="interactive" className="interactive">
        <Interactive />
        <span>
          Interactive
        </span>
      </span>
      );
    }

    if (this.props.hasVideo || Exercise.hasVideo(this.props.exercise)) {
      badges.push(<span key="video" className="video">
        <Interactive />
        <span>
          Video
        </span>
      </span>
      );
    }

    if (badges.length) {
      return (
        <div className={classes}>{badges}</div>
      );
    }
    return null;
  }

}
