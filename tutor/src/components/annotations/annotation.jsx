import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed, when } from 'mobx';
import { autobind } from 'core-decorators';
import serializeSelection from 'serialize-selection';
import cn from 'classnames';
import User from '../../models/user';
import { filter, last, sortBy, get, find, findLast, isEmpty, invokeMap, once } from 'lodash';
import Icon from '../icon';
import SummaryPage from './summary-page';
import dom from '../../helpers/dom';
import imagesComplete from '../../helpers/images-complete';
import { Logging } from 'shared';
import Courses from '../../models/courses-map';
import EditBox from './edit-box';
import SidebarButtons from './sidebar-buttons';
import InlineControls from './inline-controls';
import WindowShade from './window-shade';
import ScrollTo from '../../helpers/scroll-to';
import TextHighlighter from './highlighter';
import Router from '../../helpers/router';
import AnnotationsMap from '../../models/annotations';

const highlighter = new TextHighlighter(document.body);

function getRangeRect(win, range) {
  const rect = range.getBoundingClientRect();
  const wLeft = win.pageXOffset;
  const wTop = win.pageYOffset;
  return {
    bottom: rect.bottom + wTop,
    top: rect.top + wTop,
    left: rect.left + wLeft,
    right: rect.right + wLeft,
  };
}

// modified copy/paste out of 'serialize-selection' module
function serializeSelectionSave(referenceNode, range) {
  referenceNode = referenceNode || document.body

  const cloneRange = range.cloneRange();
  const startContainer = cloneRange.startContainer;
  const startOffset = cloneRange.startOffset;
  const state = { content: cloneRange.toString() };

  cloneRange.selectNodeContents(referenceNode);
  cloneRange.setEnd(startContainer, startOffset);

  state.start = cloneRange.toString().length;
  state.end = cloneRange.toString().length + state.content.length;

  state.restore = serializeSelection.restore.bind(null, state, referenceNode);

  return state
}


@observer
export default class AnnotationWidget extends React.Component {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    documentId: React.PropTypes.string.isRequired,
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

  scrollTo = new ScrollTo({ windowImpl: this.props.windowImpl, scrollingTargetClass: false });
  @observable scrollToPendingAnnotation;


  @observable referenceElements = [];
  @observable _activeAnnotation;
  @observable savedSelection;

  componentDidMount() {
    if (!this.course.canAnnotate) { return; }

    this.props.windowImpl.document.addEventListener('mouseup', this.onSelection);
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
    this.props.windowImpl.document.removeEventListener('mouseup', this.onSelection);
  }

  set activeAnnotation(note) {
    this._activeAnnotation = note;
    highlighter.unfocusAll();
    if (note) {
      highlighter.focus(note.elements);
    }
    if (this.activeAnnotation) { this.scrollToAnnotation(this.activeAnnotation); }
  }

  @computed get activeAnnotation() {
    return this._activeAnnotation;
  }

  @computed get course() {
    return Courses.get(this.props.courseId);
  }

  @computed get annotationsForThisPage() {
    return this.allAnnotationsForThisBook.filter(item =>
      (item.selection.chapter === this.props.chapter) &&
      (item.selection.section === this.props.section) &&
      this.referenceElements.find((el) => el.id === item.referenceElementId)
    );
  }

  @computed get allAnnotationsForThisBook() {
    return filter(this.props.annotations.array, { courseId: this.props.courseId });
  }

  setupPendingHighlightScroll(highlightId) {
    this.scrollToPendingAnnotation = () => {
      const annotation = this.props.annotations.get(highlightId);
      if (annotation) {
        highlighter.focus(annotation.elements);
        this.scrollToAnnotation(annotation);
      } else {
        Logging.error(`Page attempted to scroll to annotation id '${highlightId}' but it was not found`);
      }
      this.scrollToPendingAnnotation = null;
    };
  }


  initializePage() {
    this.ux.statusMessage.show({
      type: 'info',
      message: 'Waiting for page to finish loading…',
    });

    this.getReferenceElements();

    const win = this.props.windowImpl;
    const initialize = once(() => {
      invokeMap(this.annotationsForThisPage, 'selection.restore', highlighter);
      if (this.scrollToPendingAnnotation) {
        this.scrollToPendingAnnotation();
      }
      this.ux.statusMessage.hide();
    });

    const unprocessedMath = !!win.document.querySelector('.book-content *:not(.MJX_Assistive_MathML) > math');
    const runImagesComplete = () => imagesComplete({
      body: win.document.querySelector('.book-content'),
    })
      .finally(initialize)
    ;

    if (win.MathJax && unprocessedMath) {
      win.MathJax.Hub.Register.MessageHook('End Process', runImagesComplete);
    } else {
      runImagesComplete();
    }
  }

  getRangeSelectionInfo(range) {
    if (!range) {
      return { isCollapsed: true };
    }

    const isCollapsed = range.collapsed;
    const node = dom(range.commonAncestorContainer);

    if (!node.closest('.book-content')) {
      return { isCollapsed, outOfBounds: true };
    }

    const cloneForRange = (element, range, foundStart = false) => {
      const isStart = node => node.parentElement === range.startContainer
        && Array.prototype.indexOf.call(range.startContainer.childNodes, node) === range.startOffset;
      const isEnd = node => node.parentElement === range.endContainer
        && Array.prototype.indexOf.call(range.endContainer.childNodes, node) === range.endOffset;

      const result = element.cloneNode();

      if (element.nodeType === 3 /* #text */) {
        if (element === range.startContainer && element === range.endContainer) {
          result.textContent = element.textContent.substring(range.startOffset, range.endOffset + 1);
        } else if (element === range.startContainer) {
          result.textContent = element.textContent.substring(range.startOffset);
        } else if (element === range.endContainer) {
          result.textContent = element.textContent.substring(0, range.endOffset);
        } else {
          result.textContent = element.textContent;
        }
      } else {
        let node = element.firstChild;
        let foundEnd;

        while (node && !isEnd(node) && !foundEnd) {
          foundStart = foundStart || isStart(node);
          foundEnd = dom(node).isParent(range.endContainer);

          if (foundStart && !foundEnd) {
            const copy = node.cloneNode(true);
            result.appendChild(copy);
          } else if (foundStart || dom(node).isParent(range.startContainer)) {
            const copy = cloneForRange(node, range, foundStart);
            result.appendChild(copy);
            foundStart = true;
          }

          node = node.nextSibling;
        }
      }

      return result;
    };

    const cloneRangeContents = range => {
      const tableTags = ['TR', 'TBODY', 'TABLE'];
      const fragment = document.createDocumentFragment();

      const getStartNode = () => {
        if (range.commonAncestorContainer.nodeType === 3 /* #text */) {
          return range.commonAncestorContainer.parentNode;
        } else if (tableTags.indexOf(range.commonAncestorContainer.nodeName) > -1) {
          return dom(range.commonAncestorContainer).closest('table').parentNode;
        } else {
          return range.commonAncestorContainer;
        }
      };

      cloneForRange(getStartNode(), range).childNodes
        .forEach(node => fragment.appendChild(node.cloneNode(true)));

      return fragment;
    };

    for (const re of this.referenceElements) {
      if (dom(re).isParent(node.el)) {
        const fragment = cloneRangeContents(range);
        const container = document.createElement('div');

        container.appendChild(fragment);
        invokeMap(container.querySelectorAll('.MathJax'), 'remove');
        invokeMap(container.querySelectorAll('.MathJax_Display'), 'remove');
        invokeMap(container.querySelectorAll('.MathJax_Preview'), 'remove');
        invokeMap(container.querySelectorAll('.MJX_Assistive_MathML'), 'remove');

        container.querySelectorAll('script[type="math/mml"]').forEach(element => {
          const template = document.createElement('template');
          template.innerHTML = element.textContent;
          const math = template.content.firstChild;

          element.parentElement.insertBefore(math, element);
          element.remove();
        });

        return Object.assign(serializeSelectionSave(re, range), {
          isCollapsed,
          content: container.innerHTML,
          referenceElementId: re.id,
          rect: getRangeRect(this.props.windowImpl, range),
        });
      }
    }
    return { isCollapsed, noParent: true };
  }

  cantHighlightReason(selection) {
    // Is it a selectable area?
    if (selection.outOfBounds) {
      return 'Only content can be highlighted';
    }
    if (selection.noParent) {
      return 'Only content that is enclosed in paragraphs can be highlighted';
    }
    if (selection.splitParts) {
      return 'Only a single paragraphs can be highlighted at a time';
    }
    // Is it free from overlaps with other selections?
    // Compare by using the same reference node
    for (const other of this.annotationsForThisPage) {
      if (selection.referenceElementId === other.referenceElementId) {
        if (selection.start >= 0 &&
          (other.selection.start >= selection.start &&
            other.selection.start <= selection.end) ||
          (other.selection.end >= selection.start &&
            other.selection.end <= selection.end)) {

          return 'Highlights cannot overlap one another';
        }
      }
    }
    return null;
  }

  snapSelection() {
    const selection = this.props.windowImpl.getSelection();

    if (selection.rangeCount < 1) {
      return null;
    }

    // set up range to modify
    const range = selection.getRangeAt(0);
    const endRange = selection.getRangeAt(selection.rangeCount - 1);

    range.setEnd(endRange.endContainer, endRange.endOffset);

    if (range.collapsed) {
      return range;
    }

    // snap to table rows
    if (range.commonAncestorContainer.nodeName === 'TBODY') {
      const startRow = dom(range.startContainer).farthest('tr');
      const endRow = dom(range.endContainer).farthest('tr');

      if (startRow) {
        range.setStartBefore(startRow);
      }
      if (endRow) {
        range.setEndAfter(endRow);
      }
    }

    // snap to math
    const getMath = node => dom(node).farthest('.MathJax,.MathJax_Display');

    const startMath = getMath(range.startContainer);
    if (startMath) {
      range.setStartBefore(startMath);
    }
    const endMath = getMath(range.endContainer);
    if (endMath) {
      const endElement = dom(endMath.nextSibling).matches('script[type="math/mml"]') ? endMath.nextSibling : endMath;
      const endContainer = endElement.parentNode;
      range.setEnd(endContainer, Array.prototype.indexOf.call(endContainer.childNodes, endElement) + 1)
    }

    // snap to words
    const shouldGobbleCharacter = (container, targetOffset) =>
      targetOffset >= 0 && container.length >= targetOffset && /\S/.test(container.substringData(targetOffset, 1));

    const shouldGobbleBackward = () => {
      return shouldGobbleCharacter(range.startContainer, range.startOffset - 1);
    }
    const shouldGobbleForward = () => {
      return shouldGobbleCharacter(range.endContainer, range.endOffset);
    }
    const gobbleBackward = () => {
      range.setStart(range.startContainer, range.startOffset - 1);
    };
    const gobbleForward = () => {
      range.setEnd(range.endContainer, range.endOffset + 1);
    };
    if (range.startContainer.nodeName == '#text') {
      while (shouldGobbleBackward()) {
        gobbleBackward();
      }
    }
    if (range.endContainer.nodeName == '#text') {
      while (shouldGobbleForward()) {
        gobbleForward();
      }
    }

    selection.removeAllRanges();
    selection.addRange(range);

    return range;
  }

  @action.bound onSelection(ev) {
    if (dom(ev.target).closest('.slide-out-edit-box')) { return; }

    const range = this.snapSelection();
    const selection = this.getRangeSelectionInfo(range);

    // If it's a cursor placement with no highlighted text, check
    // for whether it's in an existing highlight
    if (selection.isCollapsed) {
      this.savedSelection = null;
      const referenceEl = document.getElementById(selection.referenceElementId);
      this.activeAnnotation = this.annotationsForThisPage.find((note) => {
        return (note.referenceElement === referenceEl) &&
          note.selection.start <= selection.start &&
          note.selection.end >= selection.start;
      });
      this.ux.statusMessage.hide();
    } else {
      const errorMessage = this.cantHighlightReason(selection);
      if (errorMessage) {
        this.savedSelection = null;
        this.ux.statusMessage.show({ message: errorMessage, autoHide: true });
      } else {
        this.activeAnnotation = null;
        this.ux.statusMessage.hide();
        this.savedSelection = selection;
      }
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
      action((annotation) => {
        this.savedSelection = null;
        annotation.selection.restore(highlighter);
        return annotation;
      }));
  }

  @autobind
  openAnnotator() {
    return this.highlightAndClose().then((annotation) => this.activeAnnotation = annotation);
  }

  @autobind
  saveNewHighlight() {
    return this.props.annotations.create({
      research_identifier: this.course.primaryRole.research_identifier,
      userRole: this.course.primaryRole.type,
      documentId: this.props.documentId,
      selection: this.savedSelection,
      courseId: this.props.courseId,
      chapter: this.props.chapter,
      section: this.props.section,
      title: this.props.title,
    });
  }

  @computed get sortedAnnotationsForPage() {
    return sortBy(
      this.annotationsForThisPage,
      ['selection.bounds.top', 'selection.start']
    );
  }

  @computed get nextAnnotation() {
    if (!get(this, 'activeAnnotation.selection.bounds')) { return null; }

    const { start, bounds: { top } } = this.activeAnnotation.selection;
    return find(this.sortedAnnotationsForPage, (hl) =>
      (hl.selection.bounds.top == top && hl.selection.start > start) || (
        hl.selection.bounds.top > top
      )
    );
  }

  @computed get previousAnnotation() {
    if (!this.activeAnnotation) { return null; }
    const { start, bounds: { top } } = this.activeAnnotation.selection;
    return findLast(this.sortedAnnotationsForPage, (hl) =>
      (hl.selection.bounds.top == top && hl.selection.start < start) || (
        hl.selection.bounds.top < top
      )
    );
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

  @action.bound hideActiveHighlight() {
    if (!this.activeAnnotation) { return; }
    if (this.activeAnnotation.isDeleted) {
      this.onAnnotationDelete(this.activeAnnotation);
    } else {
      this.activeAnnotation.selection.restore(highlighter);
    }
    this.activeAnnotation = null;
  }

  @action.bound onAnnotationDelete(annotation) {
    // just in case the annotation hasn't been mounted
    annotation.selection.restore(highlighter);
    if (annotation.isAttached) {
      annotation.elements.forEach(el => highlighter.removeHighlights(el));
    }
  }

  scrollToAnnotation(annotation) {
    if (annotation.isAttached) {
      this.scrollTo.scrollToElement(last(annotation.elements), {
        scrollTopOffset: (window.innerHeight / 2) - 80,
      });
    }
  }

  @action.bound editAnnotation(annotation) {
    this.activeAnnotation = annotation;

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
          parentRect={this.parentRect}
          selection={this.savedSelection}
          annotate={this.openAnnotator}
          highlight={this.highlightAndClose}
        />
        <EditBox
          annotation={this.activeAnnotation}
          onHide={this.hideActiveHighlight}
          goToAnnotation={this.editAnnotation}
          next={this.nextAnnotation}
          previous={this.previousAnnotation}
          seeAll={this.seeAll}
        />
        <SidebarButtons
          annotations={this.annotationsForThisPage}
          parentRect={this.parentRect}
          onClick={this.editAnnotation}
          activeAnnotation={this.activeAnnotation}
        />
        {this.renderStatusMessage()}
        <WindowShade ux={this.ux}>
          <SummaryPage
            courseId={this.props.courseId}
            annotations={this.props.annotations}
            onDelete={this.onAnnotationDelete}
            currentChapter={this.props.chapter}
            currentSection={this.props.section}
          />
        </WindowShade>
      </div>
    );
  }

}
