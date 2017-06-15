import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { autobind } from 'core-decorators';
import YouTube from 'react-youtube';
import { Button } from 'react-bootstrap';
import Icon from '../icon';
import Courses from '../../models/courses-map';
import PopoutWindow from 'shared/src/components/popout-window';

const VIDEOS = {
  college_biology: {
    homework: 'kzvHLFsQDTM',
    reading: '4neNaHRyTUw',
  },
  college_physics: {
    homework: 'Ic2_9LYXY84',
    reading: 'tCocd4jCVCA',
  },
  intro_sociology: {
    homework: 'Ki-y2AywXlI',
    reading: 'GF05th84Bw8',
  },
}


@observer
export default class BuilderPopup extends React.Component {

  static propTypes = {
    courseId:   React.PropTypes.string.isRequired,
    planType:   React.PropTypes.string.isRequired,
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

  @computed get videoId() {
    const course = Courses.get(this.props.courseId);
    if (course && VIDEOS[course.appearance_code]) {
      return VIDEOS[course.appearance_code][this.props.planType];
    }
    return null;
  }

  render() {
    const { videoId } = this;
    if (!videoId) { return null; }

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
            <h3 style={{
              color: '#424242',
              fontSize: '16px',
              fontFamily: 'HelveticaNeue, "Helvetica Neue", Helvetica, Arial, sans-serif',
              marginBottom: '1rem',
            }}>
              Student view of your own assignment coming soon!
            </h3>
            <YouTube
              videoId={videoId}
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
