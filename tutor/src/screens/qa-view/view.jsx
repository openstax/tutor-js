import React from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';
import BookPage from '../../components/book-page';
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
    const className = cn('qa-view', {
      'menu-open': ux.isMenuVisible,
      'menu-on-top': ux.isMenuOnTop,
    });

    const Content = ux.isDisplayingExercises ? Exercises : BookPage;

    return (
      <div className={className}>
        <BookMenu ux={ux} />
        <div className="content">
          <PagingNavigation
            className="book-page-wrapper"
            {...ux.pagingProps}
          >
            <Content ux={ux} />
          </PagingNavigation>
        </div>
      </div>
    );
  }

}
