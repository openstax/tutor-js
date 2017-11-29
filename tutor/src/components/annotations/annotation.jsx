import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed, when } from 'mobx';
import { autobind } from 'core-decorators';
import serializeSelection from 'serialize-selection';
import './highlighter';
import User from '../../models/user';
import { pick, debounce, filter, defer } from 'lodash';
import Icon from '../icon';
import SummaryPage from './summary-page';
import imagesComplete from '../../helpers/images-complete';
import { Logging } from 'shared';
import Courses from '../../models/courses-map';

const highlighter = new TextHighlighter(document.body);

const ERROR_DISPLAY_TIMEOUT = 1000 * 2;

function getSelectionRect(win, selection) {
  const rect = selection.getRangeAt(0).getBoundingClientRect();
  const wLeft = win.pageXOffset;
  const wTop = win.pageYOffset;

  return {
    bottom: rect.bottom + wTop,
    top: rect.top + wTop,
    left: rect.left + wLeft,
    right: rect.right + wLeft
  }
}

function scrollToSelection(win, selection) {
  const sRect = getSelectionRect(win, selection);
  const marginTop = (win.innerHeight - sRect.bottom + sRect.top) / 2;
  const startPos = win.pageYOffset;
  const startTime = Date.now();
  const endPos = sRect.top - marginTop;

  const duration = 400; // milliseconds
  // Formulas lifted from ScrollToMixin, which I can't use here
  const EASE_IN_OUT = (t) => (
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  );
  const POSITION = (start, end, elapsed, duration) => (
    elapsed > duration ? end : start + (end - start) * EASE_IN_OUT(elapsed / duration)
  );

  const step = () => {
    const elapsed = Date.now() - startTime;
    win.scrollTo(0, POSITION(startPos, endPos, elapsed, duration));
    if (elapsed < duration) {
      requestAnimationFrame(step);
    }
  };

  step();
}

const HighlightWidget = ({ style, annotate, highlight }) => (
  style ? (
    <div className="widget arrow-box" style={style}>
      <Icon type="comment" alt="annotate" onClick={annotate} />
      <Icon type="pencil" alt="highlight" onClick={highlight} />
    </div>
  ) : null
);

HighlightWidget.propTypes = {
  annotate: React.PropTypes.func.isRequired,
  highlight: React.PropTypes.func.isRequired,
  style: React.PropTypes.object,
};

const EditBox = (props) => {
  return (
    <div className={`slide-out-edit-box ${props.show}`}>
      <textarea value={props.annotation} onChange={props.updateAnnotation}></textarea>
      <div className="button-row">
        <div className="button-group">
          <button aria-label="save" className="primary" onClick={props.save}>
            <Icon type="check" />
          </button>
          <button aria-label="delete" className="secondary" onClick={props.delete}>
            <Icon type="trash" />
          </button>
        </div>
        <div className="button-group">
          <button aria-label="previous annotation" onClick={props.previous}>
            <Icon type="chevron-up" />
          </button>
          <button aria-label="next annotation" onClick={props.next}>
            <Icon type="chevron-down" />
          </button>
          <button onClick={props.seeAll}>See all</button>
        </div>
      </div>
    </div>
  );
};

const SidebarButtons = ({items, onClick, highlightEntry}) => {
  return (
    <div>
      {items.map((item, index) => {
         return (item.text.length ?
                 <Icon type="comment"
                   className="sidebar-button"
                   style={item.style}
                   alt="view annotation"
                   key={item.selection.start}
                   onClick={() => onClick(item)}
                 />
       :
                 null
         );
      })}
    </div>
  );}

const WindowShade = ({show, children}) => (
  <div className={`highlights-windowshade ${show ? 'down' : 'up'}`}>
    <div className='centered-content'>
      {children}
    </div>
  </div>
);

@observer
export default class AnnotationWidget extends React.Component {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    documentId: React.PropTypes.string.isRequired,
    windowImpl: React.PropTypes.shape({
      open: React.PropTypes.func
    }),
    pageType: React.PropTypes.string
  };

  static defaultProps = {
    windowImpl: window,
    pageType: 'reading',
  };

  @observable errorMessage = false;
  @observable activeHighlight = null;
  @observable widgetStyle = null;
  @observable scrollToPendingAnnotation;
  @computed get showWindowShade() {
    return User.annotations.ux.isSummaryVisible;
  }
  @observable canRenderSidebarButtons = false;
  @observable parentRect = {};
  @observable referenceElements = [];

  @computed get course() {
    return Courses.get(this.props.courseId);
  }

  @computed get annotationsForThisPage() {
    return this.allAnnotationsForThisBook.filter(item =>
      (item.selection.chapter === this.props.chapter) &&
      (item.selection.section === this.props.section) &&
      this.referenceElements.find((el) => el.id === item.selection.elementId)
    );
  }

  @computed get allAnnotationsForThisBook() {
    return filter(User.annotations.array, { courseId: this.props.courseId });
  }

  setupPendingHighlightScroll(windowHash) {
    const highlightMatch = windowHash.match(/highlight-(.*)/);
    if (!highlightMatch) { return; }
    this.scrollToPendingAnnotation = () => {
      const id = highlightMatch[1];
      const annotation = User.annotations.get(id);
      if (annotation) {
        const selection = this.restoreSelectionWithReferenceId(annotation.selection);
        scrollToSelection(this.props.windowImpl, selection);
      } else {
        Logging.error(`Page attempted to scroll to annotation id '${id}' but it was not found`);
      }
      this.scrollToPendingAnnotation = null;
    };
  }

  componentDidMount() {
    if (!this.course.canAnnotate) { return; }

    if (this.props.windowImpl.location.hash) {
      this.setupPendingHighlightScroll(this.props.windowImpl.location.hash);
    }

    this.handleSelectionChange = debounce(() => {
      if (!this.activeHighlight) {
        this.setWidgetStyle();
      }
    }, 1);

    when(
      () => !User.annotations.api.isPending,
      () => {
        this.initializePage().then(() => {
          defer(() => { // defer so that pending selections are complete
            this.props.windowImpl.document.addEventListener(
              'selectionchange', this.handleSelectionChange
            );
          })
        });
      },
    );
  }

  componentWillReceiveProps(nextProps) {
    if (!this.course.canAnnotate) { return; }

    if (nextProps.documentId !== this.props.documentId) {
      this.initializePage();
    }
    this.widgetStyle = null;
    this.activeHighlight = null;
  }

  componentWillUnmount() {
    this.props.windowImpl.document.removeEventListener('selectionchange', this.handleSelectionChange);
  }

  initializePage() {
    this.getReferenceElements();
    return imagesComplete(
      this.props.windowImpl.document.querySelector('.book-content')
    ).then(() => {
      this.annotationsForThisPage.forEach((annotation) => {
        this.highlightEntry(annotation);
      });
      this.canRenderSidebarButtons = true;
      if (this.scrollToPendingAnnotation) {
        this.scrollToPendingAnnotation();
      }
    });
  }

  @action.bound
  highlightEntry(entry) {
    const selection = this.restoreSelectionWithReferenceId(entry.selection);
    if (selection) {
      const rect = getSelectionRect(this.props.windowImpl, selection);
      entry.style = {
        top: rect.top - this.parentRect.top,
        position: 'absolute',
      };
      highlighter.doHighlight();
    }
  }

  saveSelectionWithReferenceId() {
    let selection;
    for (const re of this.referenceElements) {
      selection = serializeSelection.save(re);
      if (selection.start > 0) {
        selection.elementId = re.id;
        return selection;
      }
    }
    return null;
  }

  restoreSelectionWithReferenceId(savedSelection) {
    const el = document.getElementById(savedSelection.elementId);
    if (!el) {
      console.warn("Element not present:", savedSelection.elementId);
      return;
    }
    return serializeSelection.restore(savedSelection, el);
  }

  // Needs fixed
  cantHighlightReason() {
    // Is it a selectable area?
    if (!this.saveSelectionWithReferenceId()) {
      return 'Only content can be highlighted';
    }
    // Is it free from overlaps with other selections?
    // Compare by using the same reference node
    for (const hl of this.annotationsForThisPage) {
      const sel = hl.selection;
      const referenceElement = document.getElementById(sel.elementId);
      const {start, end} = serializeSelection.save(referenceElement);

      if ((start > 0 && sel.start >= start && sel.start <= end) || (sel.end >= start && sel.end <= end)) {
        return 'Highlights cannot overlap one another';
      }
    }
    return null;
  }

  @action.bound hideErrorDisplay() {
    this.errorMessage = false;
    this.errorHideTimer = null;
  }

  @action startErrorDisplay(msg) {
    if (this.erorrHideTimer) {
      this.props.windowImpl.clearTimeout(this.errorHideTimer);
    }
    this.errorMessage = msg;
    this.errorHideTimer = this.props.windowImpl.setTimeout(
      this.hideErrorDisplay,
      ERROR_DISPLAY_TIMEOUT
    );
  }

  @action.bound
  setWidgetStyle() {
    const selection = this.props.windowImpl.getSelection();

    // If it's a cursor placement with no highlighted text, check
    // for whether it's in an existing highlight
    if (selection.isCollapsed) {
      this.widgetStyle = null;
      this.savedSelection = null;
      this.activeHighlight = this.annotationsForThisPage.find((entry) => {
        const sel = entry.selection;
        const el = document.getElementById(sel.elementId);
        const { start } = serializeSelection.save(el);

        return sel.start <= start && sel.end >= start;
      });

      // Set selection, which will cause the widget to render
      if (this.activeHighlight) {
        this.restoreSelectionWithReferenceId(this.activeHighlight.selection);
      }
      this.hideErrorDisplay();
    } else {
      const errorMessage = this.cantHighlightReason();
      if (errorMessage) {
        this.savedSelection = null;
        this.startErrorDisplay(errorMessage);
        this.widgetStyle = null;
      } else {
        this.savedSelection = this.saveSelectionWithReferenceId();
        const rect = getSelectionRect(this.props.windowImpl, selection);
        const pwRect = this.parentRect;
        this.hideErrorDisplay();
        const middle = (rect.bottom - rect.top) / 2;
        const center = (rect.right - rect.left) / 2;
        this.widgetStyle = {
          top: `${rect.bottom - middle - pwRect.top}px`,
          left: `${(rect.left + center) - pwRect.left}px`,
        };
      }
    }
  }

  @action
  getReferenceElements() {
    this.referenceElements = Array.from(
      this.articleElement.querySelectorAll('.book-content > [id]')
    ).reverse();

  }

  @autobind
  highlightAndClose() {
    return this.saveNewHighlight().then(
      action((response) => {
        this.widgetStyle = null;
        this.highlightEntry(response);
        return response;
      }));
  }

  @autobind
  openAnnotator() {
    return this.highlightAndClose().then(
      action((response) => {
        this.activeHighlight = response;
      }));
  }

  @action.bound
  updateActiveAnnotation(event) {
    const newValue = event.target.value;

    this.activeHighlight.text = newValue;
  }

  @autobind
  updateAnnotation(annotation) {
    return annotation.save();
  }

  @action.bound
  updateHighlightedAnnotation() {
    const annotation = this.activeHighlight;

    this.props.windowImpl.getSelection().empty();
    this.updateAnnotation(annotation);
    this.activeHighlight = null;
  }

  @autobind
  saveNewHighlight() {
    this.props.windowImpl.getSelection().empty();
    return User.annotations.create({
      documentId: this.props.documentId,
      selection: this.savedSelection,
      courseId: this.props.courseId,
      chapter: this.props.chapter,
      section: this.props.section,
      title: this.props.title,
    });
  }

  @autobind
  deleteEntry(annotation) {
    User.annotations.destroy(annotation).then(() => {
      const selection = this.restoreSelectionWithReferenceId(annotation.selection);
      if (selection) {
        highlighter.removeHighlights(selection.baseNode.parentElement);
      }
    });
  }

  @action.bound
  deleteActiveHighlightEntry() {
    this.deleteEntry(this.activeHighlight);
    this.activeHighlight = null;
    this.props.windowImpl.getSelection().empty();
  }

  @action
  nextAnnotationInSortedList(entries) {
    const nextIndex = 1 + entries.findIndex(
      (e) => (e.selection.elementId === this.activeHighlight.selection.elementId)
      && (e.selection.start === this.activeHighlight.selection.start)
    );

    if (nextIndex < entries.length) {
      this.activeHighlight = entries[nextIndex];
      const selection = this.restoreSelectionWithReferenceId(this.activeHighlight.selection);
      scrollToSelection(this.props.windowImpl, selection);
    }
  }

  @autobind
  nextAnnotation() {
    // Because the referenceElements are reversed
    const referenceElementIds = this.referenceElements.map(el => el.id).reverse();
    const entries = this.annotationsForThisPage
    .sort(
      (a, b) => (referenceElementIds.indexOf(a.selection.elementId) - referenceElementIds.indexOf(b.selection.elementId) )
      || (a.selection.start - b.selection.start)
    );

    this.nextAnnotationInSortedList(entries);
  }

  @autobind
  previousAnnotation() {
    const referenceElementIds = this.referenceElements.map(el => el.id).reverse();
    // The trick is that the sort is reversed
    const entries = this.annotationsForThisPage.sort(
      (a, b) => (referenceElementIds.indexOf(b.selection.elementId) - referenceElementIds.indexOf(a.selection.elementId) )
      || (b.selection.start - a.selection.start)
    );

    this.nextAnnotationInSortedList(entries);
  }

  @action.bound
  getParentRect(el) {
    if (el) {
      const wLeft = this.props.windowImpl.pageXOffset;
      const wTop = this.props.windowImpl.pageYOffset;
      const parentRect = el.parentNode.getBoundingClientRect();

      action(() => {
        Object.assign(this.parentRect, {
          bottom: wTop + parentRect.bottom,
          left: wLeft + parentRect.left,
          right: wLeft + parentRect.right,
          top: wTop + parentRect.top
        });
      })();

      this.articleElement = el.parentNode;
    }
  }

  @action.bound
  seeAll() {
    User.annotations.ux.isSummaryVisible = true;
    this.activeHighlight = null;
  }

  renderSideBarButtons() {
    if (!this.canRenderSidebarButtons) { return null; }
    return (
      <SidebarButtons items={this.annotationsForThisPage}
        onClick={(item) => {this.activeHighlight = item}}
        highlightEntry={this.activeHighlight || this.widgetStyle ? null : this.highlightEntry}
      />
    );
  }

  renderErrors() {
    if (!this.errorMessage) { return null; }
    return (
      <div className="error-message-toast">
        <Icon type="exclamation-triangle" /> {this.errorMessage}
      </div>
    );
  }

  render() {
    if (!this.course.canAnnotate) { return null; }

    return (
      <div className="annotater" ref={this.getParentRect}>
        <HighlightWidget
          style={this.widgetStyle}
          annotate={this.openAnnotator}
          highlight={this.highlightAndClose}
        />
        <EditBox
          show={this.activeHighlight ? 'open' : 'closed'}
          annotation={this.activeHighlight ? this.activeHighlight.text : ''}
          updateAnnotation={this.updateActiveAnnotation}
          save={this.updateHighlightedAnnotation}
          delete={this.deleteActiveHighlightEntry}
          next={this.nextAnnotation}
          previous={this.previousAnnotation}
          seeAll={this.seeAll}
        />
        {this.renderSideBarButtons()}
        {this.renderErrors()}
        <WindowShade show={this.showWindowShade}>
          <SummaryPage
            items={this.allAnnotationsForThisBook.slice()}
            deleteEntry={this.deleteEntry}
            updateAnnotation={this.updateAnnotation}
            currentChapter={this.props.chapter}
          />
        </WindowShade>
      </div>
    );
  }

}
