import React from 'react';
import { includes } from 'lodash';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

import BuilderPopup from "../../student-preview/builder-popup";

const VALID_PLAN_TYPES = ['reading', 'homework'];

@observer
export default class PreviewButton extends React.PureComponent {

  static propTypes = {
    courseId:   React.PropTypes.string.isRequired,
    planType:   React.PropTypes.string.isRequired,
    isWaiting:  React.PropTypes.bool.isRequired,
    isNew:      React.PropTypes.bool.isRequired,
  }

  render() {
    const { planType } = this.props;

    if (!this.props.isNew ||
        this.props.isWaiting ||
        !includes(VALID_PLAN_TYPES, planType)
    ) { return null; }

    return (
      <BuilderPopup courseId={this.props.courseId} planType={planType} />
    );
  }
}
