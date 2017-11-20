import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import { autobind } from 'core-decorators';
import serializeSelection from 'serialize-selection';
import './highlighter';
import hypothesisStore from './hypothesis-store';
import {debounce} from 'lodash';
import Icon from '../icon';
import SummaryPage from './summary-page';

/*
  NOTE: Nathan pointed out that putting this into book-content-mixin could save
  having to explicitly include it in the pages that display book-content.
*/

const highlighter = new TextHighlighter(document.body);

function dbEntryToPreload(entry) {
  return {
    savedId: entry.id,
    annotation: entry.text,
    selection: entry.target[0].selector[0],
    rect: null
  };
}

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

const HighlightWidget = ({style, annotate, highlight}) => (
  style ?
    <div className="widget arrow-box" style={style}>
      <Icon type="comment" alt="annotate" onClick={annotate} />
      <Icon type="pencil" alt="highlight" onClick={highlight} />
    </div>
  : null
);

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
      if (highlightEntry) {
        highlightEntry(item);
      }

      return (item.annotation.length ?
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

const WindowShade = ({show, dismiss, children}) => (
  <div className={`highlights-windowshade ${show ? 'down' : 'up'}`}>
    <div className='centered-content'>
      <Icon className="dismiss" type="times" alt="Dismiss Highlights Summary" onClick={dismiss} />
      {children}
    </div>
  </div>
);

@observer
export default class AnnotationWidget extends React.Component {

  static propTypes = {
    ecosystemId: React.PropTypes.string.isRequired,
    documentId: React.PropTypes.string.isRequired,
    windowImpl: React.PropTypes.shape({
      open: React.PropTypes.func
    }),
    pageType: React.PropTypes.string
  };

  static defaultProps = {
    windowImpl: window,
    pageType: 'reading'
  };

  @observable activeHighlight = null;
  @observable widgetStyle = null;
  @observable needToGetReferenceElements = true;
  @observable showWindowShade = false;
  @observable allAnnotationsForThisBook = [];
  @observable parentRect = {};

  @computed get annotationsForThisPage() {
    setTimeout(() => this.forceUpdate(), 1000);
    return this.allAnnotationsForThisBook.filter((item) =>
      (item.selection.chapter === this.props.chapter) &&
      (item.selection.section === this.props.section)
    );
  }

  componentWillMount() {
    hypothesisStore.fetchAll().then(action((response) => {
      this.allAnnotationsForThisBook = response
      .map(dbEntryToPreload)
      .filter(e => e.selection.ecosystemId === this.props.ecosystemId)
      .filter(e => e.selection.chapter); // because I have some old entries that cause problems in dev
    }));
  }

  componentDidMount() {
    this.handleSelectionChange = debounce(() => {
      if (!this.activeHighlight) {
        this.setWidgetStyle();
      }
    }, 80);
    this.props.windowImpl.document.addEventListener('selectionchange', this.handleSelectionChange);
  }

  componentWillReceiveProps(nextProps) {
    this.needToGetReferenceElements = nextProps.documentId !== this.props.documentId;
    if (this.needToGetReferenceElements) {
      this.widgetStyle = null;
      this.activeHighlight = null;
    }
  }

  componentDidUpdate() {
    this.getReferenceElements();
  }

  componentWillUnmount() {
    this.props.windowImpl.document.removeEventListener('selectionchange', this.handleSelectionChange)
  }

  @action.bound
  highlightEntry(entry) {
    const selection = this.restoreSelectionWithReferenceId(entry.selection);

    if (selection) {
      const rect = getSelectionRect(this.props.windowImpl, selection);

      entry.style = {
        top: rect.top - this.parentRect.top,
        position: 'absolute'
      };
      highlighter.doHighlight();
    }
  }

  unhighlightEntry(entry) {
    // Highlight the entry, then unhighlight the highlights with the latest timestamp
    this.highlightEntry(entry);
    const highlights = highlighter.getHighlights({grouped: true});
    const lastHighlight = highlights.reduce((a, b) => a.timestamp > b.timestamp ? a : b);

    for (const el of lastHighlight.chunks) {
      highlighter.removeHighlights(el);
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
  isNotHighlightable() {
    // Is it a selectable area?
    if (!this.saveSelectionWithReferenceId()) {
      return true;
    }

    // Is it free from overlaps with other selections?
    // Compare by using the same reference node
    return this.annotationsForThisPage.find((entry) => {
      const sel = entry.selection;
      const referenceElement = document.getElementById(sel.elementId);
      const {start, end} = serializeSelection.save(referenceElement);

      return (start > 0 && sel.start >= start && sel.start <= end) ||
        (sel.end >= start && sel.end <= end)
    });
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
        const {start} = serializeSelection.save(el);

        return sel.start <= start && sel.end >= start;
      })

      // Set selection, which will cause the widget to render
      if (this.activeHighlight) {
        this.restoreSelectionWithReferenceId(this.activeHighlight.selection);
      }
    } else if (this.isNotHighlightable()){
      console.warn("Selection must be in .book-content and not overlap other selections");
      this.widgetStyle = null;
    } else {
      this.savedSelection = this.saveSelectionWithReferenceId();
      const rect = getSelectionRect(this.props.windowImpl, selection);
      const pwRect = this.parentRect;

      this.widgetStyle = {
        top: `${rect.bottom - pwRect.top}px`,
        left: `${rect.left - pwRect.left}px`
      };
    }
  }

  @action
  getReferenceElements() {
    if (this.needToGetReferenceElements) {
      this.needToGetReferenceElements = false;

      this.referenceElements = Array.from(
        this.articleElement.querySelectorAll('.book-content > [id]')
      ).reverse();
    }
  }

  @autobind
  highlightAndClose() {
    return this.saveHighlight().then(
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

    this.activeHighlight.annotation = newValue;
  }

  @autobind
  updateAnnotation(entry) {
    if (entry.lastSavedAnnotation !== entry.annotation) {
      hypothesisStore.update(entry.savedId, entry.annotation).then(
        action((response) => {
          entry.lastSavedAnnotation = entry.annotation;
          return entry;
        }));
    }
  }

  @action.bound
  updateHighlightedAnnotation() {
    const entry = this.activeHighlight;

    this.props.windowImpl.getSelection().empty();
    this.updateAnnotation(entry);
    this.activeHighlight = null;
  }

  @autobind
  saveHighlight() {
    this.props.windowImpl.getSelection().empty();

    return hypothesisStore.save(this.props.documentId, this.savedSelection, '',
      {
        ecosystemId: this.props.ecosystemId,
        chapter: this.props.chapter,
        section: this.props.section,
        title: this.props.title
      }
    ).then(action((response) => {
        // Have to make it observable before pushing it, or it won't be the same
        // object as what is in the observable array
        const newEntry = observable(dbEntryToPreload(response));

        this.allAnnotationsForThisBook.push(newEntry);
        return newEntry;
      }));
  }

  @autobind
  deleteEntry(savedId) {
    hypothesisStore.delete(savedId).then(
      action((response) => {
        const oldIndex = this.allAnnotationsForThisBook.findIndex((e) => e.savedId === response.id);

        this.allAnnotationsForThisBook.splice(oldIndex, 1);
      }));
  }

  @action.bound
  deleteActiveHighlightEntry() {
    this.unhighlightEntry(this.activeHighlight);
    this.deleteEntry(this.activeHighlight.savedId);
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
    const entries = this.annotationsForThisPage.sort(
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
    this.showWindowShade = true;
    this.activeHighlight = null;
  }

  render() {
    return this.props.pageType === 'reading' ?
      <div className="annotater" ref={this.getParentRect}>
        <HighlightWidget
          style={this.widgetStyle}
          annotate={this.openAnnotator}
          highlight={this.highlightAndClose}
        />
        <EditBox
          show={this.activeHighlight ? 'open' : 'closed'}
          annotation={this.activeHighlight ? this.activeHighlight.annotation : ''}
          updateAnnotation={this.updateActiveAnnotation}
          save={this.updateHighlightedAnnotation}
          delete={this.deleteActiveHighlightEntry}
          next={this.nextAnnotation}
          previous={this.previousAnnotation}
          seeAll={this.seeAll}
        />
        <SidebarButtons items={this.annotationsForThisPage}
          onClick={(item) => {this.activeHighlight = item}}
          highlightEntry={this.activeHighlight || this.widgetStyle ? null : this.highlightEntry}
        />
        <WindowShade
          show={this.showWindowShade}
          dismiss={action(() => this.showWindowShade = false)}>
          <SummaryPage
            items={this.allAnnotationsForThisBook.slice()}
            deleteEntry={this.deleteEntry}
            updateAnnotation={this.updateAnnotation}
            currentChapter={this.props.chapter}
            showing={this.showWindowShade}
          />
        </WindowShade>
      </div>
      :
      null
    ;
  }

}
