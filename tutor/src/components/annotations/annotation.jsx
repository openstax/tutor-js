import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import { autobind } from 'core-decorators';
import serializeSelection from 'serialize-selection';
import './highlighter';
import HYPOTHESIS from '../../models/hypothesis';
import hypothesisStore from './hypothesis-store';
import {debounce} from 'lodash';
import {ReferenceBookPageStore} from '../../flux/reference-book-page';
import Icon from '../icon';

const highlighter = new TextHighlighter(document.body);

function dbEntryToPreload(entry) {
  return {
    savedId: entry.id,
    annotation: entry.text,
    selection: entry.target[0].selector[0]
  };
}

function getSelectionRect(selection) {
  const rect = selection.getRangeAt(0).getBoundingClientRect();
  const wLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const wTop = window.pageYOffset || document.documentElement.scrollTop;

  return {
    bottom: rect.bottom + wTop,
    top: rect.top + wTop,
    left: rect.left + wLeft,
    right: rect.right + wLeft
  }
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
    <div className={`edit-box ${props.show}`}>
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
          <button>See all</button>
        </div>
      </div>
    </div>
  );
};

const SidebarButtons = ({items, offsetTop, onClick}) => (
  <div>
    {items.map((item, index) => {
      const style = {
        top: item.rect.top - offsetTop,
        position: 'absolute'
      };

      return (
        <Icon type="comment"
          className="sidebar-button"
          style={style}
          alt="view annotation"
          key={item.selection.start}
          onClick={() => onClick(item)}
        />
      );
    })}
  </div>
);

@observer
export default class AnnotationWidget extends React.Component {

  static propTypes = {
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
  @observable widgetStyle = {display: 'none'};
  @observable preload = [];
  @observable needToLoadAnnotations = true;

  @computed get withAnnotations() {
    return this.preload.filter((item) => item.annotation.length > 0 && item.rect);
  }

  @autobind
  updateWidgetStyle() {

  }

  componentDidMount() {
    this.handleSelectionChange = debounce(() => {
      if (!this.activeHighlight) {
        this.setWidgetStyle();
      }
    }, 80);
    this.props.windowImpl.document.addEventListener('selectionchange', this.handleSelectionChange)
    this.restoreAnnotations();
  }

  componentWillReceiveProps(nextProps) {
    this.needToLoadAnnotations = nextProps.documentId !== this.props.documentId;
  }

  componentDidUpdate() {
    this.restoreAnnotations();
  }

  componentWillUnmount() {
    this.props.windowImpl.document.removeEventListener('selectionchange', this.handleSelectionChange)
  }

  highlightEntry(entry) {
    const selection = serializeSelection.restore(entry.selection, this.articleElement);

    if (! ('rect' in entry)) {
      entry.rect = getSelectionRect(selection);
    }
    highlighter.doHighlight();
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

  findOverlap() {
    const selection = serializeSelection.save(this.articleElement);
    const start = selection.start;
    const end = selection.end;

    return this.preload.find((entry) => {
      const sel = entry.selection;

      return (sel.start >= start && sel.start <= end) ||
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
      const start = serializeSelection.save(this.articleElement).start;
      this.activeHighlight = this.preload.find((entry) => {
        const sel = entry.selection;

        return sel.start <= start && sel.end >= start;
      })

      // Set selection, which will cause the widget to render
      if (this.activeHighlight) {
        serializeSelection.restore(this.activeHighlight.selection, this.articleElement);
      }
    } else if (this.findOverlap()){
      console.warn("NO OVERLAPPING SELECTIONS!");
      this.widgetStyle = null;
    } else {
      this.savedSelection = serializeSelection.save(this.articleElement);
      const rect = getSelectionRect(selection);
      const pwRect = this.parentRect;

      this.widgetStyle = {
        top: `${rect.bottom - pwRect.top}px`,
        left: `${rect.left - pwRect.left}px`
      };
    }
  }

  restoreAnnotations() {
    if (this.needToLoadAnnotations) {
      hypothesisStore.fetch(this.props.documentId).then(action(
        (response) => {
          const newPreload = response.rows.map(dbEntryToPreload);

          for (const entry of newPreload) {
            this.highlightEntry(entry);
          }
          this.preload = newPreload;
        }));
      this.needToLoadAnnotations = false;
    }
  }

  @action.bound
  highlightAndClose() {
    return this.saveAnnotation().then(
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

    this.activeHighlight = Object.assign(
      {},
      this.activeHighlight,
      {annotation: newValue}
    );
  }

  @action.bound
  updateAnnotation() {
    const oldEntry = this.preload.find((e) => e.savedId === this.activeHighlight.savedId);

    this.props.windowImpl.getSelection().empty();
    if (oldEntry.annotation !== this.activeHighlight.annotation) {
      hypothesisStore.update(this.activeHighlight.savedId, this.activeHighlight.annotation).then(
        action((response) => {
          const oldEntry = this.preload.find((e) => e.savedId === response.id);

          Object.assign(oldEntry, dbEntryToPreload(response));
          return oldEntry;
        }));
    }
    this.activeHighlight = null;
  }

  @action.bound
  saveAnnotation() {
    this.props.windowImpl.getSelection().empty();

    return hypothesisStore.save(this.props.documentId, this.savedSelection, '')
      .then(action((response) => {
        const newEntry = dbEntryToPreload(response);
        const newPreload = this.preload.slice();

        newPreload.push(newEntry);
        this.preload = newPreload;
        return newEntry;
      }));
  }

  @action.bound
  deleteEntry() {
    this.unhighlightEntry(this.activeHighlight);
    hypothesisStore.delete(this.activeHighlight.savedId).then(
      action((response) => {
        const oldIndex = this.preload.findIndex((e) => e.savedId === response.id);
        const newPreload = this.preload.slice();

        newPreload.splice(oldIndex, 1);
        this.preload = newPreload;
      }));
    this.activeHighlight = null;
    this.props.windowImpl.getSelection().empty();
  }

  @action
  nextAnnotationInSortedList(entries) {
    const nextIndex = 1 + entries.findIndex((e) => e.selection.start === this.activeHighlight.selection.start);

    if (nextIndex < entries.length) {
      this.activeHighlight = entries[nextIndex];
      serializeSelection.restore(entries[nextIndex].selection, this.articleElement);
    }
  }

  @autobind
  nextAnnotation() {
    const entries = this.preload.sort((a, b) => a.selection.start - b.selection.start);

    this.nextAnnotationInSortedList(entries);
  }

  @autobind
  previousAnnotation() {
    // The trick is that the sort is reversed
    const entries = this.preload.sort((a, b) => b.selection.start - a.selection.start);

    this.nextAnnotationInSortedList(entries);
  }

  @autobind
  getParentRect(el) {
    if (el) {
      const wLeft = this.props.windowImpl.pageXOffset || document.documentElement.scrollLeft;
      const wTop = this.props.windowImpl.pageYOffset || document.documentElement.scrollTop;
      const parentRect = el.parentNode.getBoundingClientRect();

      this.articleElement = el.parentNode;
      this.parentRect = {
        bottom: wTop + parentRect.bottom,
        left: wLeft + parentRect.left,
        right: wLeft + parentRect.right,
        top: wTop + parentRect.top
      }
    }
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
          save={this.updateAnnotation}
          delete={this.deleteEntry}
          next={this.nextAnnotation}
          previous={this.previousAnnotation}
        />
        <SidebarButtons items={this.withAnnotations}
          offsetTop={this.parentRect ? this.parentRect.top : 0}
          onClick={(item) => {this.activeHighlight = item}}
        />
      </div>
      :
      null
    ;
  }

}
