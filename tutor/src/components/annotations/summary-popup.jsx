import React from 'react';
import {observer} from 'mobx-react';
import {action, observable, computed} from 'mobx';
import {Button} from 'react-bootstrap';
import Icon from '../icon';
import PopoutWindow from 'shared/src/components/popout-window';
import {map} from "lodash";

@observer
export default class SummaryPopup extends React.Component {

  static propTypes = {
    windowImpl: React.PropTypes.shape({
      open: React.PropTypes.func,
    }),
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
    return (
      <Button
        className="print-btn pull-right"
        onClick={this.openSummaryWindow}
      >
        <PopoutWindow
          title="Annotation Summary Print Page"
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
              {map(this.props.annotations, (notes, ch) =>
                <div key={ch}>
                  <h2>{notes[0].formattedChapterSection} {notes[0].title}</h2>
                  {map(notes, (annotation) => (
                    <div key={annotation.id}>
                    <p style={{fontStyle: 'italic'}}>
                      {annotation.selection.content}
                    </p>
                    <p>
                    {annotation.text}
                    </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PopoutWindow>
        <Icon type="print"/>
        Print this page
      </Button>
    );
  }
}
