import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import Offering from '../../models/course/offerings/offering';
import CourseInformation from '../../models/course/information';
import { ReactHelpers } from 'shared';

@observer
export default class CourseOfferingTitle extends React.PureComponent {
  static propTypes = {
    offering: React.PropTypes.instanceOf(Offering).isRequired,
    className:  React.PropTypes.string,
    children:   React.PropTypes.node,
  }

  render() {
    const { offering: { appearance_code }, children, className } = this.props;
    const baseName = ReactHelpers.getBaseName(this);
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
