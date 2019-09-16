import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'react-bootstrap';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import Router from '../../helpers/router';
import { OnboardingNag, Heading, Body, Footer } from './nag-components';
export { GotItOnboardingNag, OnboardingNag, Heading, Body, Footer };

@observer
class GotItOnboardingNag extends React.Component {
  static propTypes = {
    ux: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    promptRenderer: PropTypes.func.isRequired,
  }

  @observable noProblemo = false;

  @action.bound onAddCourse() {
    this.props.history.push(
      Router.makePathname('myCourses')
    );
  }

  @action.bound onContinue() {
    if (this.noProblemo) {
      this.props.ux.dismissNag();
    } else {
      this.noProblemo = true;
    }
  }

  renderNoProblem() {
    return (
      <OnboardingNag className="got-it">
        <Body>
          When you’re ready to create a real course, click “Create a course” on the top right of your dashboard.
        </Body>
        <Footer className="got-it">
          <Button variant="primary" onClick={this.onContinue}>Got it</Button>
        </Footer>
      </OnboardingNag>
    );
  }

  render() {
    return this.noProblemo ?
      this.renderNoProblem() : this.props.promptRenderer(this.onAddCourse, this.onContinue);
  }
}
