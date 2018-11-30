import { idType } from 'shared';
import PropTypes from 'prop-types';
import React from 'react';
import { includes } from 'lodash';
import { observer } from 'mobx-react';
import BuilderPopup from './builder-popup';

const VALID_PLAN_TYPES = ['reading', 'homework'];

export default
@observer
class PreviewButton extends React.Component {

  static propTypes = {
    courseId:   idType.isRequired,
    planType:   PropTypes.string.isRequired,
    isWaiting:  PropTypes.bool.isRequired,
    isNew:      PropTypes.bool.isRequired,
  }

  render() {
    const { planType } = this.props;

    if (!includes(VALID_PLAN_TYPES, planType)) { return null; }

    return (
      <BuilderPopup courseId={this.props.courseId} planType={planType} />
    );
  }
};
