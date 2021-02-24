import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'react-bootstrap';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { OnboardingNag, Body, Heading, Footer } from './onboarding-nag';
import TutorLink from '../link';

@observer
export default
class CourseUseTips extends React.Component {

  static propTypes = {
      ux: PropTypes.object.isRequired,
      onDismiss: PropTypes.func.isRequired,
  }

  @computed get course() {
      return this.props.ux.course;
  }

  @computed get downloadHelp() {
      if (!this.course.bestPracticesDocumentURL) { return null; }
      return (
          <span>
        Also, <a href={this.course.bestPracticesDocumentURL} className="best-practices" target="_blank">download our best practices PDF</a> so you can make the most of OpenStax Tutor.
          </span>
      );
  }

  render() {
      return (
          <OnboardingNag className="course-use-tips">
              <Heading>
          Great news! Let's pioneer the future of better learning together.
              </Heading>
              <Body>
          Your students can access your course as soon as you send them the enrollment code, found on
          the <TutorLink to="courseSettings" params={{ courseId: this.course.id }}>Course settings</TutorLink>. {this.downloadHelp}
              </Body>
              <Footer className="got-it">
                  <Button variant="primary" onClick={this.props.onDismiss}>Got it</Button>
              </Footer>
          </OnboardingNag>
      );
  }


}
