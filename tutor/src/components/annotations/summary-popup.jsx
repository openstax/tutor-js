import React from 'react';
import {observer} from 'mobx-react';
import { isEmpty, map } from 'lodash';
import {action, observable, computed} from 'mobx';
import {Button} from 'react-bootstrap';
import Icon from '../icon';
import Courses from '../../models/courses-map';
import PopoutWindow from 'shared/src/components/popout-window';

@observer
export default class SummaryPopup extends React.Component {

  static propTypes = {
    windowImpl: React.PropTypes.shape({
      open: React.PropTypes.func,
    }),
    courseId: React.PropTypes.string.isRequired,
    annotations: React.PropTypes.object.isRequired
  }

  @observable isOpen = false;

  static defaultProps = {
    windowImpl: window,
  }

  @action.bound onSummaryWindowClose() {
    this.isOpen = false;
  }

  @action.bound openSummaryWindow() {
    this.isOpen = true;
    this.popup.open();
  }

  @action.bound onPopupReady(popup) {
    this.popup = popup;
    this.popup.print();
  }

  render() {
    const { courseId, annotations } = this.props;
    if (isEmpty(annotations)) { return null; }

    const course = Courses.get(courseId);
    return (
      <div>
        <Button
          className="print-btn"
          onClick={this.openSummaryWindow}
        >
          <Icon type="print"/> Print this page
        </Button>
        <PopoutWindow
          title={`${course.name} highlights and notes`}
          onReady={this.onPopupReady}
          ref={pw => (this.popup = pw)}
          windowImpl={this.props.windowImpl}
          onClose={this.onSummaryWindowClose}
          options={{
            height: 500,
            width: 700,
          }}
        >
          <div className="summary-preview summary-popup">
            <div className="annotations">
              {map(annotations, (notes, ch) =>
                <div key={ch}>
                  <h2>{notes[0].formattedChapterSection} {notes[0].title}</h2>
                  {map(notes, (annotation) => (
                    <div
                      key={annotation.id}
                      style={{
                        marginBottom: '2rem',
                      }}
                      >
                      <blockquote
                        style={{
                          fontStyle: 'italic',
                          margin: '0 0 1rem 0.5rem',
                          borderLeft: '2px solid lightgrey',
                          paddingLeft: '0.5rem',
                        }}
                      >
                        {annotation.selection.content}
                      </blockquote>
                      <p
                        style={{
                          marginLeft: '0.5rem',
                        }}
                      >
                        {annotation.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PopoutWindow>
      </div>
    );
  }
}
