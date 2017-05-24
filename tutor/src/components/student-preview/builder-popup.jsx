import React from 'react';
import { observer } from 'mobx-react';
import { autobind } from 'core-decorators'
import YouTube from 'react-youtube';
import { Button } from 'react-bootstrap';
import Icon from '../icon';

import PopoutWindow from 'shared/src/components/popout-window';

function videoIdForCourse(courseId) {
  return 'emjbBoV0Ixs';  // in future we'll have reading/hw etc.
}

@observer
export default class BuilderPopup extends React.Component {

  static propTypes = {
    courseId:   React.PropTypes.string.isRequired,
    windowImpl: React.PropTypes.shape({
      open: React.PropTypes.func,
    }),
  }

  static defaulProps = {
    windowImpl: window,
  }

  onPreviewWindowClose() {
    this.isOpen = false;
  }

  @autobind
  openPreviewWindow() {
    this.popup.open();
  }

  render() {
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
            <h3 style={{ color: 'darkGrey' }}>
              Student view of your own assignment coming soon!
            </h3>
            <YouTube
              videoId={videoIdForCourse(this.props.courseId)}
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
