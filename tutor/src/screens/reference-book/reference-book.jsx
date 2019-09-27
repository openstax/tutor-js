import { React, observer, cn } from 'vendor';
import PropTypes from 'prop-types';
import { SpyMode } from 'shared';
import ObscuredPage from '../../components/obscured-page';
import Menu from '../../components/book-menu/menu';
import Page from '../../components/book-page';
import LoadingScreen from 'shared/components/loading-animation';

import ReferenceViewPageNavigation from './page-navigation';
import UX from './ux';

const BookPage = observer(({ ux }) => {
  if (ux.page) {
    return (
      <ReferenceViewPageNavigation ux={ux}>
        <Page {...ux.pageProps} />
      </ReferenceViewPageNavigation>
    );
  } else {
    return (
      <div className="book-page-wrapper not-found">
        <h1>Section {ux.chapterSection} was not found</h1>
      </div>
    );
  }
});

export default
@observer
class ReferenceBook extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    className: PropTypes.string,
  };

  render() {
    const { ux } = this.props;
    const Content = ux.isFetching ? LoadingScreen : BookPage;

    const className = cn('reference-book', this.props.className, {
      'menu-open': ux.isMenuVisible,
      'menu-on-top': ux.isMenuOnTop,
    });

    return (
      <div {...ux.dataProps} className={className}>
        <SpyMode.Wrapper>
          <ObscuredPage>
            <div className="content">
              <Menu ux={ux} />
              <Content ux={ux} />
            </div>
          </ObscuredPage>
        </SpyMode.Wrapper>
      </div>
    );
  }
}
