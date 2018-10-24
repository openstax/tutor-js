import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed, when } from 'mobx';
import { autobind } from 'core-decorators';
import serializeSelection from 'serialize-selection';
import cn from 'classnames';
import User from '../../models/user';
import { filter, last, sortBy, get, find, findLast, forEach, invokeMap, once } from 'lodash';
import Icon from '../icon';
import SummaryPage from './summary-page';
import dom from '../../helpers/dom';
import imagesComplete from '../../helpers/images-complete';
import { Logging } from 'shared';
import Courses from '../../models/courses-map';
import EditBox from './edit-box';
import SidebarButtons from './sidebar-buttons';
import InlineControls from './inline-controls';
import ScrollTo from '../../helpers/scroll-to';
import Highlighter from '@openstax/highlighter';
import Router from '../../helpers/router';
import AnnotationsMap from '../../models/annotations';
import Overlay from '../obscured-page/overlay';

@observer
export default class AnnotationWidget extends React.Component {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    documentId: React.PropTypes.string,
    windowImpl: React.PropTypes.shape({
      open: React.PropTypes.func,
    }),
    title: React.PropTypes.string,
    chapter: React.PropTypes.number.isRequired,
    section: React.PropTypes.number.isRequired,
    annotations: React.PropTypes.instanceOf(AnnotationsMap),
  };

  static defaultProps = {
    annotations: User.annotations,
    windowImpl: window,
  };

  scrollHelper = new ScrollTo({ windowImpl: this.props.windowImpl, scrollingTargetClass: false });
  highlightScrollHandler = elements => this.scrollHelper.scrollToElement(last(elements), {
    scrollTopOffset: (window.innerHeight / 2) - 80,
  });

  @observable scrollToPendingAnnotation;
  @observable highlighter;
  @observable referenceElements = [];
  @observable activeAnnotation;
  @observable pendingHighlight;

  componentDidMount() {
    if (!this.course.canAnnotate) { return; }

    const { highlight } = Router.currentQuery();

    if (highlight) {
      this.setupPendingHighlightScroll(highlight);
    }

    when(
      () => !this.props.annotations.api.isPending,
      () => this.initializePage(),
    );
  }

  componentWillReceiveProps() {
    if (!this.course.canAnnotate) { return; }
    this.activeAnnotation = null;
    this.initializePage();
  }

  componentWillUnmount() {
    if (this.highlighter) {
      this.highlighter.unmount();
    }
  }

  @computed get course() {
    return Courses.get(this.props.courseId);
  }

  @computed get annotationsForThisPage() {
    return this.allAnnotationsForThisBook.filter(item =>
      (item.chapter === this.props.chapter) &&
      (item.section === this.props.section) &&
      this.highlighter &&
      item.highlight.isLoadable(this.highlighter)
    );
  }

  @computed get allAnnotationsForThisBook() {
    return filter(this.props.annotations.array, { courseId: this.props.courseId });
  }

  setupPendingHighlightScroll(highlightId) {
    this.scrollToPendingAnnotation = () => {
      const highlight = this.highlighter.getHighlight(highlightId);

      this.highlighter.clearFocus();
      if (highlight) {
        highlight.focus().scrollTo(this.highlightScrollHandler);
      } else {
        Logging.error(`Page attempted to scroll to annotation id '${highlightId}' but it was not found`);
      }
      this.scrollToPendingAnnotation = null;
    };
  }

  waitForPageReady() {
    return new Promise(resolve => {
      const win = this.props.windowImpl;
      const unprocessedMath = !!win.document.querySelector('.book-content *:not(.MJX_Assistive_MathML) > math');
      const runImagesComplete = () => imagesComplete({
        body: win.document.querySelector('.book-content'),
      })
        .finally(resolve)
      ;

      if (win.MathJax && unprocessedMath) {
        win.MathJax.Hub.Register.MessageHook('End Process', runImagesComplete);
      } else {
        runImagesComplete();
      }
    });
  }

  getBookContentRef() {
    return this.props.windowImpl.document.querySelector('.book-content');
  }

  initializePage() {
    this.ux.statusMessage.show({
      type: 'info',
      message: 'Waiting for page to finish loading…',
    });

    this.getReferenceElements();
    if (!this.referenceElements.length) { return; }

    const initialize = action(() => {
      // remove any existing highlighter
      if (this.highlighter) {
        this.highlighter.unmount();
      }
      // create a new highlighter, but don't set instance yet
      this.highlighter = new Highlighter(this.getBookContentRef(), {
        snapTableRows: true,
        snapMathJax: true,
        snapWords: true,
        className: 'tutor-highlight',
        onClick: this.onHighlightClick,
        onSelect: this.onHighlightSelect,
      });
      // attach annotations ot highlghter
      this.annotationsForThisPage.forEach(annotation => this.highlighter.highlight(annotation.highlight));
      // scroll if needed
      if (this.scrollToPendingAnnotation) {
        this.scrollToPendingAnnotation();
      }
      // and we're done
      this.ux.statusMessage.hide();
    });

    this.waitForPageReady().then(initialize);
  }

  onHighlightClick = highlight => {
    const annotation = highlight ? this.props.annotations.get(highlight.id) : null;
    this.pendingHighlight = null;
    this.activeAnnotation = annotation;

    this.highlighter.clearFocus();
    if (highlight) {
      highlight.focus().scrollTo(this.highlightScrollHandler);
    }
  };

  cantHighlightReason(highlights, highlight) {
    if (highlights.length > 0) {
      return 'Highlights cannot overlap one another';
    }
    const node = dom(highlight.range.commonAncestorContainer);

    if (!node.closest('.book-content')) {
      return 'Only content can be highlighted';
    }

    for (const re of this.referenceElements) {
      if (dom(re).isParent(node.el)) {
        return null;
      }
    }

    return 'Only content that is enclosed in paragraphs can be highlighted';
  }

  @action.bound onHighlightSelect(highlights, highlight) {
    this.activeAnnotation = null;
    const error = this.cantHighlightReason(highlights, highlight);

    if (error) {
      this.pendingHighlight = null;
      this.ux.statusMessage.show({ message: error, autoHide: true });
    } else {
      this.pendingHighlight = highlight;
      this.ux.statusMessage.hide();
    }
  }

  @action
  getReferenceElements() {
    this.referenceElements = Array.from(
      this.props.windowImpl.document.querySelectorAll('.book-content > [id]')
    ).reverse();
  }

  @autobind
  highlightAndClose() {
    return this.saveNewHighlight().then(
      action(annotation => {
        this.props.windowImpl.getSelection().removeAllRanges();
        this.pendingHighlight = null;
        this.highlighter.highlight(annotation.highlight);
        return annotation;
      }));
  }

  @autobind
  openAnnotator() {
    return this.highlightAndClose().then(annotation => this.activeAnnotation = annotation);
  }

  @autobind
  saveNewHighlight() {
    const highlight = this.pendingHighlight;

    const referenceElement = this.referenceElements
      .find(re => dom(re).isParent(highlight.range.commonAncestorContainer));

    const serializedHighlight = highlight.serialize(referenceElement);

    return this.props.annotations.create({
      research_identifier: this.course.primaryRole.research_identifier,
      userRole: this.course.primaryRole.type,
      documentId: this.props.documentId,
      courseId: this.props.courseId,
      chapter: this.props.chapter,
      section: this.props.section,
      title: this.props.title,
      ...serializedHighlight.data
    });
  }

  @computed get sortedAnnotationsForPage() {
    return sortBy(
      this.annotationsForThisPage,
      ['selection.bounds.top', 'selection.start']
    );
  }

  getAnnotationByOffset(offset) {
    const annotation = this.activeAnnotation;
    if (!annotation) {
      return null;
    }
    const highlight = this.highlighter.getHighlight(annotation.id);
    if (!highlight) {
      return null;
    }

    const highlights = this.highlighter.getHighlights();
    const targetIndex = highlights.indexOf(highlight) + offset;

    if (!highlights[targetIndex]) {
      return null;
    }

    const targetAnnotationId = highlights[targetIndex].id;

    return this.props.annotations.get(targetAnnotationId);
  }

  get nextAnnotation() {
    return this.getAnnotationByOffset(1);
  }

  get previousAnnotation() {
    return this.getAnnotationByOffset(-1);
  }

  @action.bound setElement(el) {
    this.element = el;
  }

  get parentRect() {
    if (!this.element) {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }
    const wLeft = this.props.windowImpl.pageXOffset;
    const wTop = this.props.windowImpl.pageYOffset;
    const parentRect =  this.element.parentElement.getBoundingClientRect();
    return {
      bottom: wTop + parentRect.bottom,
      left: wLeft + parentRect.left,
      right: wLeft + parentRect.right,
      top: wTop + parentRect.top,
    };
  }

  @computed get ux() { return this.props.annotations.ux; }

  @action.bound seeAll() {
    this.ux.isSummaryVisible = true;
    this.activeAnnotation = null;
  }

  @action.bound editAnnotation(annotation) {
    this.activeAnnotation = annotation;

    this.highlighter.clearFocus();
    const highlight = this.highlighter.getHighlight(annotation.id);
    if (highlight) {
      highlight.focus().scrollTo(this.highlightScrollHandler);
    }
  }

  @action.bound hideActiveHighlight() {
    this.activeAnnotation = null;
  }

  @action.bound onAnnotationDelete(annotation) {
    const highlight = this.highlighter.getHighlight(annotation.id);
    if (highlight) {
      this.highlighter.erase(highlight);
    }
  }

  renderStatusMessage() {
    if (!this.ux.statusMessage.display) { return null; }

    return (
      <div
        className={cn('status-message-toast', this.ux.statusMessage.type)}
      >
        <Icon type={this.ux.statusMessage.icon} /> {this.ux.statusMessage.message}
      </div>
    );
  }

  render() {
    if (!this.course.canAnnotate) { return null; }

    return (
      <div className="annotater" ref={this.setElement}>
        <InlineControls
          pendingHighlight={this.pendingHighlight}
          windowImpl={this.props.windowImpl}
          parentRect={this.parentRect}
          annotate={this.openAnnotator}
          highlight={this.highlightAndClose}
        />
        <EditBox
          annotation={this.activeAnnotation}
          onHide={this.hideActiveHighlight}
          onDelete={this.onAnnotationDelete}
          goToAnnotation={this.editAnnotation}
          next={this.nextAnnotation}
          previous={this.previousAnnotation}
          seeAll={this.seeAll}
        />
        <SidebarButtons
          windowImpl={this.props.windowImpl}
          highlighter={this.highlighter}
          annotations={this.annotationsForThisPage}
          parentRect={this.parentRect}
          onClick={this.editAnnotation}
          activeAnnotation={this.activeAnnotation}
        />
        {this.renderStatusMessage()}
        <Overlay
          id="annotations-summary"
          visible={this.ux.isSummaryVisible}
          onHide={this.ux.hideSummary}
          renderer={() => (
            <SummaryPage
              courseId={this.props.courseId}
              annotations={this.props.annotations}
              onDelete={this.onAnnotationDelete}
              currentChapter={this.props.chapter}
              currentSection={this.props.section}
            />
          )}
        />
      </div>
    );
  }

}
