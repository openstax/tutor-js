import React from 'react';
import MiniNotice from './mini-notice';
import NewTabLink from '../../new-tab-link';
import { Button } from 'react-bootstrap';
import { action } from 'mobx';
import Icon from '../../icon';
import TutorLink from '../../link';

export default class Biology2eAvailable extends React.Component {

  @action.bound onClose() {
    this.props.step.joyrideRef.next();
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
          Download <NewTabLink href="https://openstax.secure.force.com/help/articles/How_To/Where-can-I-find-book-information-and-the-additional-resources?search=biology%202e">a summary</NewTabLink> of the key changes from the first edition of Biology to Biology 2e.
        </div>
        <div className="footer">
          <TutorLink to="createNewCourse" className="btn btn-primary">
            Create a Biology 2e course
          </TutorLink>
          <Button onClick={this.onClose}>
            Close
          </Button>
        </div>
      </MiniNotice>
    );
  }
}
