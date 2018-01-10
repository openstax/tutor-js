import React from 'react';
// import Survey from 'survey-react';
import { observable, computed, action, observe } from 'mobx';
import { observer, inject } from 'mobx-react';

// import onboardingForCourse from '../../models/course/onboarding';
// import Courses from '../../models/courses-map';
// import WarningModal from '../../components/warning-modal';
// import './styles.scss';


@observer
export default class Surveys extends React.PureComponent {

  static propTypes = {
    survey: React.PropTypes.object.isRequired,

  }

  @computed model() {
    var model = new Survey.Model(json);
  }

  componentDidMount() {
    Survey.Survey.cssType = "bootstrap";
  }

  render() {
    return <Survey.Survey model={model} />;
  }


}
