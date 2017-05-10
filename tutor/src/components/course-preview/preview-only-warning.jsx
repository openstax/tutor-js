import React from 'react';
import { Button } from 'react-bootstrap';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import CoursePreviewUX from '../../models/course/preview-ux';

import Router from '../../helpers/router';

import { NagWarning, Heading, Body, Footer } from './nag-components';

@observer
export default class PreviewOnlyWarning extends React.PureComponent {
  static propTypes = {
    ux: React.PropTypes.instanceOf(CoursePreviewUX).isRequired,
  }
  static contextTypes = {
    router: React.PropTypes.object,
  }

  @action.bound
  onAddCourse() {
    this.context.router.transitionTo(
      Router.makePathname('createNewCourse')
    );
  }

  @action.bound
  onContinue() {
    this.props.ux.isDismissed = true;
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
