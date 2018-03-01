import React from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';
import BookMenu from '../../components/book-menu/menu';
import PagingNavigation from '../../components/paging-navigation';
import Loading from '../../components/loading-screen';
import Exercises from './exercises';
import UX from './ux';

@observer
export default class QAView extends React.Component {

  static propTypes = {
    ux: React.PropTypes.instanceOf(UX).isRequired,
  };

  render() {
    const { ux } = this.props;
    if (!ux.activePage) {
      return <Loading message="Fetching Book…" />;
    }
    const className = cn('screen', 'qa', {
      'menu-open': ux.isMenuVisible,
      'menu-on-top': ux.isMenuOnTop,
    });

    return (
      <div className={className}>
        <BookMenu ux={ux} />
        <PagingNavigation
          className="book-page"
          {...ux.pagingProps}
        >
          <Exercises ux={ux} />
        </PagingNavigation>

      </div>

    );
  }

}
