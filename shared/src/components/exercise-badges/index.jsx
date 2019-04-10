import PropTypes from 'prop-types';
import React from 'react';
import Interactive from './interactive-icon';
import MultiPart from './multipart-icon';
import classnames from 'classnames';

export default class ExerciseBadges extends React.Component {

  static propTypes = {
    withMultiPart:    PropTypes.bool,
    withInteractive: PropTypes.bool,
    withVideo:       PropTypes.bool,
    flags:          PropTypes.object,
    className:      PropTypes.string,
  }

  static defaultProps = {
    withMultipart: false,
    withInteractive: false,
    withVideo: false,
  }

  render() {
    const { flags, withMultiPart, withInteractive, withVideo } = this.props;

    const classes = classnames('openstax-exercise-badges', this.props.className);
    const badges = [];
    if (withMultiPart) {
      badges.push(<span key="mpq" className="mpq">
        <MultiPart />
        <span>
          Multi-part question
        </span>
      </span>
      );
    }

    if (withInteractive) {
      badges.push(<span key="interactive" className="interactive">
        <Interactive />
        <span>
          Interactive
        </span>
      </span>
      );
    }

    if (withVideo) {
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
