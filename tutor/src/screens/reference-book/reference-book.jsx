import { React, observer, cn } from '../../helpers/react';
import { SpyMode } from 'shared';

import Menu from '../../components/book-menu/menu';
import Page from '../../components/book-page';

import ReferenceViewPageNavigation from './page-navigation';
import UX from './ux';

const WrappedPage = observer(({ ux }) => {
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

@observer
export default class ReferenceBook extends React.Component {

  static propTypes = {
    ux: React.PropTypes.instanceOf(UX).isRequired,
    className: React.PropTypes.string,
  };

  render() {
    const { ux } = this.props;

    const className = cn('reference-book', this.props.className, {
      'menu-open': ux.isMenuVisible,
      'menu-on-top': ux.isMenuOnTop,
    });

    return (
      <div {...ux.dataProps} className={className}>
        <SpyMode.Wrapper>
          <div className="content">
            <Menu ux={ux} />
            <WrappedPage ux={ux} />
          </div>
        </SpyMode.Wrapper>
      </div>
    );
  }
}
