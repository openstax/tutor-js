import React from 'react';
import { action } from 'mobx';
import { Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { PreviewWarning, NagWarning, Heading, Body, Footer } from './preview-warning';

@observer
export default class PreviewOnlyWarning extends PreviewWarning {


  @action.bound
  onContinue() {
    this.props.ux.hasViewedPublishWarning();
  }

  render() {
    const { ux } = this.props;

    return (
      <NagWarning className="only-preview">
        <Heading>
          Remember -- this is just a preview course!
        </Heading>
        <Body>
          If you’re ready to create real assignments your students can see, create your real course now. It’s free for you and students will pay {ux.formattedStudentCost} per course per semester.
        </Body>
        <Footer>
          <Button bsStyle="primary" onClick={this.onAddCourse}>Create a course</Button>
          <Button onClick={this.onContinue}>Stay in Preview course</Button>
        </Footer>
      </NagWarning>
    );
  }
}
