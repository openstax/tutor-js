import React from 'react';
import { Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { PreviewWarning, NagWarning, Heading, Body, Footer } from './preview-warning';

@observer
export default class SecondSessionWarning extends PreviewWarning {

  renderPrompt() {
    const { ux } = this.props;
    return (
      <NagWarning className="second-session-prompt">
        <Body>
          Ready to create your real course? It’s free for you and students will pay {ux.formattedStudentCost} per course per semester.
        </Body>
        <Footer>
          <Button bsStyle="primary" onClick={this.onAddCourse}>Create your course</Button>
          <Button onClick={this.onContinue}>Ask me later</Button>
        </Footer>
      </NagWarning>
    );
  }

}
