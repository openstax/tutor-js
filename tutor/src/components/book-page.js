import PropTypes from 'prop-types';
import React from 'react';
import { get, map, forEach } from 'lodash';
import createReactClass from 'create-react-class';
import ReactDOM from 'react-dom';
import { LoadingAnimation, SpyMode, ArbitraryHtmlAndMath, GetPositionMixin } from 'shared';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { BookContentMixin } from './book-content-mixin';
import { ReferenceBookExerciseShell } from './book-page/exercise';
import RelatedContent from './related-content';

import NotesWidget from './notes';
import { ReferenceBookExerciseActions, ReferenceBookExerciseStore } from '../flux/reference-book-exercise';

const BookPage = createReactClass({
  displayName: 'BookPage',

  propTypes: {
    ux: PropTypes.object.isRequired,
  },

  mixins: [BookContentMixin, GetPositionMixin],

  getCnxId() {
    return this.props.ux.page.cnx_id;
  },

  UNSAFE_componentWillMount() {
    return this.props.ux.page.ensureLoaded();
  },

  UNSAFE_componentWillReceiveProps() {
    return this.props.ux.page.ensureLoaded();
  },

  getSplashTitle() {
    return this.props.ux.page.title;
  },

  componentDidMount() {
    return this.props.ux.checkForTeacherContent();
  },

  componentDidUpdate() {
    return this.props.ux.checkForTeacherContent();
  },

  // used by BookContentMixin
  shouldOpenNewTab() { return true; },

  waitToScrollToSelector(hash) {
    const images = ReactDOM.findDOMNode(this).querySelectorAll('img');
    let imagesToLoad = images.length;
    const onImageLoad = () => {
      imagesToLoad -= 1;
      if (imagesToLoad === 0) {
        // final scroll to
        this.scrollToSelector(hash);
      }
    };
    for (let image of images) {
      image.addEventListener('load', onImageLoad);
    }

    return images.length > 0;
  },

  renderExercises(exerciseLinks) {
    ReferenceBookExerciseStore.setMaxListeners(exerciseLinks.length);
    const links = map(exerciseLinks, 'href');
    if (!ReferenceBookExerciseStore.isLoaded(links)) { ReferenceBookExerciseActions.loadMultiple(links); }

    return forEach(exerciseLinks, this.renderExercise);
  },

  renderExercise(link) {
    const exerciseAPIUrl = link.href;
    const exerciseNode = link.parentNode.parentNode;
    if (exerciseNode != null) {
      return ReactDOM.render(<ReferenceBookExerciseShell exerciseAPIUrl={exerciseAPIUrl} />, exerciseNode);
    }
    return null;
  },

  render() {
    let isLoading;
    let { ux, ux: { page } } = this.props;

    if (!page || page.api.isPending) {
      if (ux.lastSection) {
        isLoading = true;
        page = ux.pages.byChapterSection.get(ux.lastSection);
      } else {
        return <LoadingAnimation />;
      }
    }


    const related = {
      chapter_section: page.chapter_section.asArray,
      title: this.getSplashTitle(),
    };

    return (
      <div
        className={classnames('book-page', this.props.className, {
          'page-loading loadable is-loading': isLoading,
          'book-is-collated': page.bookIsCollated,
        })}
        {...ux.courseDataProps}>
        {this.props.children}
        <div className="page center-panel">
          <RelatedContent contentId={page.cnx_id} {...related} />
          <ArbitraryHtmlAndMath className="book-content" block={true} html={page.contents} />
        </div>
        <SpyMode.Content className="ecosystem-info">
          Page: {page.cnx_id}, Book: {get(page,'chapter.book.cnx_id')} Ecosystem: {get(page,'chapter.book.uuid')}
        </SpyMode.Content>
        {ux.allowsAnnotating && (
          <NotesWidget
            courseId={ux.course.id}
            chapter={page.chapter_section.chapter}
            section={page.chapter_section.section}
            title={related.title}
            documentId={page.cnx_id} />
        )}
      </div>
    );
  },
});

export default observer(BookPage);
