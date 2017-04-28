import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { isEmpty } from 'lodash';

import { OfferingsStore } from '../../flux/offerings';
import CourseInformation from '../../flux/course-information';
import { ReactHelpers } from 'shared';

@observer
export default class CourseOfferingTitle extends React.PureComponent {
  static propTypes = {
    offeringId: React.PropTypes.string.isRequired,
    className:  React.PropTypes.string,
    children:   React.PropTypes.node,
  }

  render() {
    const { offeringId, children, className } = this.props;
    const baseName = ReactHelpers.getBaseName(this);
    if (isEmpty(OfferingsStore.get(offeringId))) { return null; }

    const { appearance_code } = OfferingsStore.get(offeringId);
    const { title } = CourseInformation.forAppearanceCode(appearance_code);
    return (
      <div
        className={classnames(baseName, className)}
        data-appearance={appearance_code}>
        <div className="contents">
          <div className="title">
            {title}
          </div>
          <div className="sub-title">
            {children}
          </div>
        </div>
      </div>
    );
  }
}
