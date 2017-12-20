import { defer } from 'lodash';
import { Popover } from 'react-bootstrap';
import React from 'react';

// NOTE: this selector must be kept in sync with CNX as well as
// the style in components/reference-book/page.less
const TEACHER_CONTENT_SELECTOR = '.os-teacher';

class TeacherContentToggle extends React.Component {
  static propTypes = {
    onChange:   React.PropTypes.func.isRequired,
    isShowing:  React.PropTypes.bool,
    section:    React.PropTypes.string,
    windowImpl: React.PropTypes.object,
  };

  static defaultProps = { windowImpl: window };
  state = { hasTeacherContent: false };

  onClick = (ev) => {
    ev.preventDefault();
    if (this.state.hasTeacherContent === true) { return this.props.onChange(!this.props.isShowing); }
  };

  componentDidMount() { return this.scheduleCheckForTeacherContent(); }
  componentDidUpdate() { return this.scheduleCheckForTeacherContent(); }
  componentWillUnmount() { if (this.state.pendingCheck) { return clearTimeout(this.state.pendingCheck); } }

  scheduleCheckForTeacherContent = () => {
    if (this.state.pendingCheck) { return; }
    return (
      this.setState({ pendingCheck: defer(this.checkForTeacherContent) })
    );
  };

  checkForTeacherContent = () => {
    return (
      this.setState({
        pendingCheck: false,
        hasTeacherContent: !!this.props.windowImpl.document.querySelector(TEACHER_CONTENT_SELECTOR),
      })
    );
  };

  renderNoContentTooltip = () => {
    return (
      <Popover id="no-content">
        No teacher edition content is available for this page.
      </Popover>
    );
  };

  render() {
    const teacherLinkText = this.props.isShowing ?
      'Hide Teacher Edition'
      :
      'Show Teacher Edition';

    if (this.state.hasTeacherContent) {
      return (
        (
          <span className="has-content">
            {teacherLinkText}
          </span>
        )
      );
    } else {
      return (
        (
          <BS.OverlayTrigger
            placement="bottom"
            trigger="click"
            overlay={this.renderNoContentTooltip()}>
            <span className="no-content">
              {teacherLinkText}
            </span>
          </BS.OverlayTrigger>
        )
      );
    }
  }
}


export default TeacherContentToggle;
