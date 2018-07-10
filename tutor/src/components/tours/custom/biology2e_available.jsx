import React from 'react';
import MiniNotice from './mini-notice';
import NewTabLink from '../../new-tab-link';
import { Button } from 'react-bootstrap';
import { action } from 'mobx';
import Icon from '../../icon';
import Router from '../../../helpers/router';

export default class Biology2eAvailable extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object,
  };

  @action.bound onClose() {
    this.props.step.joyrideRef.next();
  }

  @action.bound onCreate() {
    this.onClose();
    this.context.router.history.push(
      Router.makePathname('createNewCourseFromOffering', { appearanceCode: 'biology_2e' })
    );
  }

  render () {
    return (
      <MiniNotice {...this.props} className="biology2e-available">
        <div className="heading">
          <Icon type="bullhorn" />
          <div className="text">
            OpenStax now uses Biology 2e! <br />
            Courses using Biology 1e can no longer be copied.
          </div>
        </div>
        <div className="body">
          Biology 2e has new assessments and improved art and explanations.
          Download our <NewTabLink href="https://d3bxy9euw4e147.cloudfront.net/oscms-prodcms/media/documents/biology_2e_conversion_guide_-_digital.pdf">transition guide</NewTabLink> to see the key changes from the first edition of Biology to Biology 2e.
        </div>
        <div className="footer">
          <Button bsStyle="primary" onClick={this.onCreate}>
            Create a Biology 2e course
          </Button>
          <Button onClick={this.onClose}>
            Close
          </Button>
        </div>
      </MiniNotice>
    );
  }
}
