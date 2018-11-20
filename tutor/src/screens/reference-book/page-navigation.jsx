import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import PagingNavigation from '../../components/paging-navigation';
import UX from './ux';


export default
@observer
class ReferenceViewPageNavigation extends React.Component {
  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
  };

  render() {
    const { ux } = this.props;
    return (
      <PagingNavigation
        className="book-page-wrapper"
        {...ux.pagingProps}
      >
        {this.props.children}
      </PagingNavigation>
    );
  }
};
