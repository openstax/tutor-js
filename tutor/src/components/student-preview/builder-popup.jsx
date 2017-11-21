import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { autobind } from 'core-decorators';
import YouTube from 'react-youtube';
import { Button } from 'react-bootstrap';
import Icon from '../icon';
import Courses from '../../models/courses-map';
import PopoutWindow from 'shared/src/components/popout-window';
import StudentPreviewUX from '../../models/course/student-preview-ux';

@observer
export default class BuilderPopup extends React.Component {

  static propTypes = {
    courseId:   React.PropTypes.string.isRequired,
    planType:   React.PropTypes.string.isRequired,
    windowImpl: React.PropTypes.shape({
      open: React.PropTypes.func,
    }),
  }

  static defaultProps = {
    windowImpl: window,
  }

  onPreviewWindowClose() {
    this.isOpen = false;
  }

  @autobind
  openPreviewWindow() {
    this.popup.open();
  }

  ux = new StudentPreviewUX(
    Courses.get(this.props.courseId), this.props.planType
  )

  render() {
    const { builderVideoId } = this.ux;
    if (!builderVideoId) { return null; }

    return (
      <Button
        className="preview-btn pull-right"
        onClick={this.openPreviewWindow}
      >
        <PopoutWindow
          title="What students see"
          ref={pw => (this.popup = pw)}
          windowImpl={this.props.windowImpl}
          onClose={this.onPreviewWindowClose}
          options={{
            height: 500,
            width: 700,
          }}
        >
          <div className="student-preview builder-popup">
            <p style={{
              color: '#424242',
              fontSize: '16px',
              fontFamily: 'HelveticaNeue, "Helvetica Neue", Helvetica, Arial, sans-serif',
              marginBottom: '1rem',
            }}>
              Student view of your own assignment coming soon!
            </p>
            <YouTube
              videoId={builderVideoId}
              opts={{
                width: '100%',
                playerVars: {
                  autoplay: 1,
                },
              }}
            />
          </div>
        </PopoutWindow>
        <Icon type="video-camera" />
        What do students see?
      </Button>
    );
  }
}
