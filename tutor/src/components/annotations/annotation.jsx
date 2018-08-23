import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed, when } from 'mobx';
import { autobind } from 'core-decorators';
import serializeSelection from 'serialize-selection';
import cn from 'classnames';
import './highlighter';
import User from '../../models/user';
import { filter, last, sortBy, get, find, findLast, isEmpty, invokeMap } from 'lodash';
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

function getSelectionRect(win, selection) {
  const rect = selection.getRangeAt(0).getBoundingClientRect();
  const wLeft = win.pageXOffset;
  const wTop = win.pageYOffset;
  return {
    bottom: rect.bottom + wTop,
    top: rect.top + wTop,
    left: rect.left + wLeft,
    right: rect.right + wLeft,
  };
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

  componentWillReceiveProps(nextProps) {
    if (!this.course.canAnnotate) { return; }
    if (nextProps.documentId !== this.props.documentId) {
      this.activeAnnotation = null;
      this.initializePage();
    }
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
    const initialize = () => {
      invokeMap(this.annotationsForThisPage, 'selection.restore', highlighter);
      if (this.scrollToPendingAnnotation) {
        this.scrollToPendingAnnotation();
      }
      this.ux.statusMessage.hide();
    };
    
    const unprocessedMath = !!win.document.querySelector('.book-content *:not(.MJX_Assistive_MathML) > math');
    const runImagesComplete = () => imagesComplete({
      body: win.document.querySelector('.book-content'),
    }).then(initialize).catch(initialize);
    
    if (win.MathJax && unprocessedMath) {
      win.MathJax.Hub.Register.MessageHook('End Process', runImagesComplete);
    } else {
      runImagesComplete();
    }
  }

  getCurrentSelectionInfo() {
    const selection = document.getSelection();

    // can happen if dom was modified after mouseup
    if (!selection.anchorNode) { return { isCollapsed: true }; }
    const node = dom(selection.anchorNode);
    const { isCollapsed } = selection;
    if (!node.closest('.book-content')) {
      return { isCollapsed, outOfBounds: true };
    }

    for (const re of this.referenceElements) {
      if (node.isParent(re)) {

        if (!dom(selection.focusNode).isParent(re)) {
          return { isCollapsed, splitParts: true };
        }

        const frag = selection.getRangeAt(0).cloneContents();
        invokeMap(frag.querySelectorAll('.MathJax'), 'remove');
        invokeMap(frag.querySelectorAll('.MathJax_Preview'), 'remove');
        invokeMap(frag.querySelectorAll('.MJX_Assistive_MathML'), 'remove');

        const container = document.createElement('div');
        container.appendChild(frag);

        container.querySelectorAll('script[type="math/mml"]').forEach(element => {
          const template = document.createElement('template');
          template.innerHTML = element.textContent;
          const math = template.content.firstChild;

          element.parentElement.insertBefore(math, element);
          element.remove();
        });

        return Object.assign(serializeSelection.save(re), {
          isCollapsed,
          content: container.innerHTML,
          referenceElementId: re.id,
          rect: getSelectionRect(this.props.windowImpl, selection),
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
    const selection = window.getSelection();

    if (selection.isCollapsed || selection.rangeCount < 1) {
      return;
    }

    // snap to math
    const range = selection.getRangeAt(0);
    const getMath = node => dom(node).farthest('.MathJax,.MathJax_Display'); 

    const startMath = getMath(range.startContainer); 
    if (startMath) {
      range.setStartBefore(startMath);
    }
    const endMath = getMath(range.endContainer);
    if (endMath) {
      const mml = dom(endMath.nextSibling).matches('script[type="math/mml"]') ? endMath.nextSibling : null; 
      range.setEndAfter(mml || endMath);
    }

    selection.removeAllRanges();
    selection.addRange(range);

    // snap to words
    const endNode = selection.focusNode;
    const endOffset = selection.focusOffset;

    const shouldGobbleCharacter = (container, targetOffset) =>
      targetOffset >= 0 && container.length >= targetOffset && /\S/.test(container.substringData(targetOffset, 1));

    const shouldGobbleBackward = () => {
      const range = selection.getRangeAt(0);
      return shouldGobbleCharacter(range.startContainer, range.startOffset - 1);
    }
    const shouldGobbleForward = () => {
      const range = selection.getRangeAt(0);
      return shouldGobbleCharacter(range.endContainer, range.endOffset);
    }

    if (range.startContainer.nodeName == '#text') {
      selection.collapse(selection.anchorNode, selection.anchorOffset);

      while (shouldGobbleBackward()) {
        selection.modify("move", "backward", "character");
      }

      selection.extend(endNode, endOffset);
    }
    if (range.endContainer.nodeName == '#text') {
      while (shouldGobbleForward()) {
        selection.modify("extend", "forward", "character");
      }
    }
  }

  @action.bound onSelection(ev) {
    if (dom(ev.target).closest('.slide-out-edit-box')) { return; }

    this.snapSelection();
    const selection = this.getCurrentSelectionInfo();

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
