import PropTypes from 'prop-types';
import React from 'react';
import { Button, Collapse } from 'react-bootstrap';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { map, partial } from 'lodash';
import { OnboardingNag, Body, Footer } from './onboarding-nag';

@observer
export default
class FreshlyCreatedCourse extends React.Component {

  static propTypes = {
    ux: PropTypes.object.isRequired,
  }

  @observable isShowingWhy = false;

  @action.bound toggleWhy() {
    this.isShowingWhy = !this.isShowingWhy;
  }

  @action.bound
  onChoice(id) {
    this.props.ux.recordExpectedUse(id);
  }

  render() {
    return (
      <OnboardingNag className="freshly-created-course">
        <Body>
          <p>
            Now that you've created your OpenStax Tutor course, tell us how you plan to use it:
          </p>

          <Button
            variant="link"
            onClick={this.toggleWhy}
            aria-expanded={this.isShowingWhy}
          >
            Why are you asking?
          </Button>
          <Collapse in={this.isShowingWhy}>
            <p>
              OpenStax Tutor is funded by philanthropic foundations
              who want to know how their gifts impact student learning.
              Your confirmation helps us send accurate student numbers
              to our foundation supporters, helping to secure
              future funding.
            </p>
          </Collapse>

        </Body>
        <Footer>
          {map(this.props.ux.usageOptions, (txt, id) =>
            <Button
              key={id}
              variant={id === 'cc' ? 'primary' : 'default'}
              onClick={partial(this.onChoice, id)}
            >
              {txt}
            </Button>)}
        </Footer>
      </OnboardingNag>
    );
  }
}
