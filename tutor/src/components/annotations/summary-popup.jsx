import React from 'react';
import {observer} from 'mobx-react';
import { isEmpty, map } from 'lodash';
import {action, observable, computed} from 'mobx';
import {Button} from 'react-bootstrap';
import Icon from '../icon';
import SummaryListing from './summary-listing';
import PopoutWindow from 'shared/src/components/popout-window';


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
    const { annotations } = this.props;
    if (isEmpty(annotations)) { return null; }

    return (
      <div>
        <Button
          className="print-btn"
          onClick={this.openSummaryWindow}
        >
          <Icon type="print"/> Print this page
        </Button>
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
            <SummaryListing annotations={annotations} />
          </div>
        </PopoutWindow>
      </div>
    );
  }
}
