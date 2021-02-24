import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import PagingNavigation from '../../components/paging-navigation';
import UX from './ux';


@observer
export default
class ReferenceViewPageNavigation extends React.Component {
  static propTypes = {
      ux: PropTypes.instanceOf(UX).isRequired,
      children: PropTypes.node,
  };

  render() {
      const { ux } = this.props;
      return (
          <PagingNavigation
              className="book-page-wrapper"
              renderMobileFooter={true}
              {...ux.pagingProps}
          >
              {this.props.children}
          </PagingNavigation>
      );
  }
}
