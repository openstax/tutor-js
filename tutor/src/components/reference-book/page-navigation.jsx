/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';
import BS from 'react-bootstrap';
import React from 'react';

import classnames from 'classnames';

import Router from '../../helpers/router';
import PagingNavigation from '../paging-navigation';
//import { ReferenceBookStore } from '../../flux/reference-book';
import { ChapterSectionMixin } from 'shared';
import UX from './ux';

class ReferenceViewPageNavigation extends React.Component {
  static propTypes = {
    ux: React.PropTypes.instanceOf(UX).isRequired,
    //
    //     pageNavRouterLinkTarget: React.PropTypes.string.isRequired,
    //     ecosystemId: React.PropTypes.string.isRequired,
    //     section: React.PropTypes.string,
    //     cnxId: React.PropTypes.string,
    //     onPageNavigationClick: React.PropTypes.func,
  };

  //  mixins: [ChapterSectionMixin]

  // static contextTypes = {
  //   router: React.PropTypes.object,
  // };

  // onNavigation = (info, href) => {
  //   if (typeof this.props.onPageNavigationClick === 'function') {
  //     this.props.onPageNavigationClick(info.chapter_section, ev);
  //   }
  //   return (
  //     this.context.router.history.push(href)
  //   );
  // };

  render() {
    const { ux } = this.props;

    // let nextUrl, prevUrl;
    // const pageInfo = ReferenceBookStore.getPageInfo(this.props) || {};
    // const params = _.extend({ ecosystemId: this.props.ecosystemId }, Router.currentParams());
    //
    //     if (pageInfo.next) {
    //
    //       nextUrl = Router.makePathname( this.props.pageNavRouterLinkTarget,
    //         _.extend({}, params, { section: this.sectionFormat(pageInfo.next.chapter_section) }),
    //         Router.currentQuery()
    //       );
    //     }
    //
    //     if (pageInfo.prev) {
    //       prevUrl = Router.makePathname( this.props.pageNavRouterLinkTarget,
    //         _.extend({}, params, { section: this.sectionFormat(pageInfo.prev.chapter_section) }),
    //         Router.currentQuery()
    //       );
    //     }
    //
    return (
      <PagingNavigation
        className="reference-book-page"
        {...ux.pagingProps}
      >
        {this.props.children}
      </PagingNavigation>
    );
  }
}

export default ReferenceViewPageNavigation;
