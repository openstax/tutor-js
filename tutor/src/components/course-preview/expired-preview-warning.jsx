import React from 'react';
import { Button } from 'react-bootstrap';
import { observer } from 'mobx-react';

import { PreviewWarning, NagWarning, Heading, Body, Footer } from './preview-warning';

@observer
export default class ExpiredPreviewWarning extends PreviewWarning {

  renderPrompt() {
    return (
      <NagWarning className="only-preview">
        <Heading>
          This preview course has expired.
        </Heading>
        <Body>
          Want to create a real course that students can access? Click “Create a course” on the top right of your dashboard.
        </Body>
        <Footer>
          <Button bsStyle="primary" onClick={this.onAddCourse}>Create a course</Button>
          <Button onClick={this.onContinue}>Stay in Preview course</Button>
        </Footer>
      </NagWarning>
    );
  }

}
