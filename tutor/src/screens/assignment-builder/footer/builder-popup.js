import { idType } from 'shared';
import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { autobind } from 'core-decorators';
import YouTube from '../../../components/youtube';
import { Button } from 'react-bootstrap';
import { Icon } from 'shared';
import Courses from '../../../models/courses-map';
import PopoutWindow from 'shared/components/popout-window';
import StudentPreviewUX from '../../../models/course/student-preview-ux';

export default
@observer
class BuilderPopup extends React.Component {

  static propTypes = {
    courseId:   idType.isRequired,
    planType:   PropTypes.string.isRequired,
    windowImpl: PropTypes.shape({
      open: PropTypes.func,
    }),
  }

  @observable isOpen = false;

  static defaultProps = {
    windowImpl: window,
  }

  @action.bound onPreviewWindowClose() {
    this.isOpen = false;
  }

  @action.bound openPreviewWindow() {
    this.isOpen = true;
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
        variant="default"
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
        <Icon type="video" />
        What do students see?
      </Button>
    );
  }
};
