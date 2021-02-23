import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Button } from 'react-bootstrap';
import { Icon } from 'shared';
import WarningModal from '../warning-modal';
import SupportEmailLink from '../support-email-link';


function Success({ toast: { info: { url } } }) {
  return (
    <div className="toast scores success">
      <div className="title">Scores successfully exported</div>
      <div className="body">
        Check your computer's Downloads folder for the spreadsheet.
      </div>
      <iframe id="downloadExport" src={url} />
    </div>
  );
}

Success.propTypes = {
  toast: PropTypes.any,
}

@observer
class Failure extends React.Component {

  static propTypes = {
    dismiss: PropTypes.func.isRequired,
    toast: PropTypes.object.isRequired,
  }

  @observable showDetails = false;
  @action.bound onShowDetails() { this.showDetails = true; }

  render() {
    if (this.showDetails) {
      return (
        <WarningModal
          backdrop={false}
          title="Scores not exported"
          footer={<Button className="dismiss" onClick={this.props.dismiss}>Close</Button>}
        >
          The scores spreadsheet could not be exported. Return
          to the student scores page to try again.  If
          this problem persists, please contact <SupportEmailLink />.
        </WarningModal>
      );
    }
    return (
      <div className="toast scores failure">
        <div className="title">
          Scores not exported
          <Icon type="close" className="dismiss" onClick={this.props.dismiss} />
        </div>
        <div className="body">
          <Button className="details" variant="link" onClick={this.onShowDetails}>Details</Button>
        </div>
      </div>
    );
  }
}

export { Failure, Success };
