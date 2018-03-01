import React from 'react';
import { observer } from 'mobx-react';
import PagingNavigation from '../../components/paging-navigation';
import UX from './ux';


@observer
export default class ReferenceViewPageNavigation extends React.Component {
  static propTypes = {
    ux: React.PropTypes.instanceOf(UX).isRequired,
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
}
