import React from 'react';
import { Button } from 'react-bootstrap';
import { action, observable } from 'mobx';
import { observer, PropTypes as MobxPropTypes  } from 'mobx-react';
import Router from '../../helpers/router';
import { NagWarning, Heading, Body, Footer } from './nag-components';

export { NagWarning, Heading, Body, Footer };

@observer
export class PreviewWarning extends React.PureComponent {
  static propTypes = {
    ux: MobxPropTypes.observableObject.isRequired,
  }
  static contextTypes = {
    router: React.PropTypes.object,
  }

  @observable noProblemo = false;

  @action.bound
  onAddCourse() {
    this.context.router.transitionTo(
      Router.makePathname('createNewCourse')
    );
  }

  @action.bound
  onContinue() {
    if (this.noProblemo) {
      this.props.ux.isDismissed = true;
    } else {
      this.noProblemo = true;
    }
  }

  renderNoProblem() {
    return (
      <NagWarning className="second-session-prompt got-it">
        <Body>
          No problem. When you’re ready to create a real course, click “Create a course” on the top right of your dashboard.
        </Body>
        <Footer>
          <Button bsStyle="primary" onClick={this.onContinue}>Got it</Button>
        </Footer>
      </NagWarning>
    );
  }

  render() {
    return this.noProblemo ? this.renderNoProblem() : this.renderPrompt();
  }
}
