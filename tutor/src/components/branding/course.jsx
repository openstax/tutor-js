import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { omit, keys } from 'lodash';

const BRAND = 'OpenStax';

@observer
export default
class CourseBranding extends React.Component {

  static propTypes = {
      isConceptCoach: PropTypes.bool,
      isBeta:         PropTypes.bool,
      tag:            PropTypes.string,
      className:      PropTypes.string,
  }

  static defaultProps = {
      tag:            'span',
      isConceptCoach: false,
  }

  propsToOmit = keys(this.constructor.propTypes)

  render() {
      let brand;
      let { isConceptCoach, isBeta, className } = this.props;

      const brandProps = omit(this.props, this.propsToOmit);
      const Tag = this.props.tag;

      if (isConceptCoach) {
          if (isBeta == null) { isBeta = false; }
          brand = `${BRAND} Concept Coach`;
      } else {
          if (isBeta == null) { isBeta = true; }
          brand = `${BRAND} Tutor`;
      }

      return (
          <Tag
              className={classnames('course-branding', className)}
              data-is-beta={isBeta}
              {...brandProps}>
              {brand}
          </Tag>
      );
  }
}
