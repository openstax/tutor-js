import React from 'react';
import serializeSelection from 'serialize-selection';
import './highlighter';
import HYPOTHESIS from '../../models/hypothesis';
import hypothesisStore from './hypothesis-store';
import _ from 'underscore';
import {ReferenceBookPageStore} from '../../flux/reference-book-page';

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
    <div className="widget arrow_box" style={style}>
      <i className="fa fa-comment" role="button" alt="annotate" onClick={annotate}></i>
      <i className="fa fa-pencil" role="button" alt="highlight" onClick={highlight}></i>
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
            <i className="fa fa-check"></i>
          </button>
          <button aria-label="delete" className="secondary" onClick={props.delete}>
            <i className="fa fa-trash"></i>
          </button>
        </div>
        <div className="button-group">
          <button aria-label="previous annotation" onClick={props.previous}>
            <i className="fa fa-chevron-up" role="button" ></i>
          </button>
          <button aria-label="next annotation">
            <i className="fa fa-chevron-down" role="button" onClick={props.next}></i>
          </button>
          <button>See all</button>
        </div>
      </div>
    </div>
  );
};

const SidebarButtons = ({items, offsetTop, onClick}) => (
  <div>
    {items.filter((item) => item.rect).map((item, index) => {
      const style = {
        right: 0,
        top: item.rect.top - offsetTop,
        position: 'absolute'
      };

      return item.annotation.length ?
        <button className="sidebar-button" style={style} key={item.selection.start} onClick={() => onClick(item)}>
          <i className="fa fa-comment"></i>
        </button>
        :
        null;
    })}
  </div>
);

export default class AnnotationWidget extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      activeHighlight: null,
      widgetStyle: {display: 'none'},
      preload: [],
      needToLoadAnnotations: true
    };
  }

  componentDidMount() {
    this.handleSelectionChange = _.debounce(() => {
      if (!this.state.activeHighlight) {
        this.setWidgetStyle();
      }
    }, 80);
    window.document.addEventListener('selectionchange', this.handleSelectionChange)
    this.restoreAnnotations();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      needToLoadAnnotations: nextProps.documentId !== this.props.documentId
    });
  }

  componentDidUpdate() {
    this.restoreAnnotations();
  }

  componentWillUnmount() {
    window.document.removeEventListener('selectionchange', this.handleSelectionChange)
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

    return this.state.preload.find((entry) => {
      const sel = entry.selection;

      return (sel.start >= start && sel.start <= end) ||
        (sel.end >= start && sel.end <= end)
    });
  }

  setWidgetStyle() {
    const selection = window.getSelection();

    // If it's a cursor placement with no highlighted text, check
    // for whether it's in an existing highlight
    if (selection.isCollapsed) {
      this.setState({widgetStyle: null});
      this.savedSelection = null;
      const start = serializeSelection.save(this.articleElement).start;
      this.setState({
        activeHighlight: this.state.preload.find((entry) => {
          const sel = entry.selection;

          return sel.start <= start && sel.end >= start;
        })
      });

      // Set selection, which will cause the widget to render
      if (this.state.activeHighlight) {
        serializeSelection.restore(this.state.activeHighlight.selection, this.articleElement);
      }
    } else if (this.findOverlap()){
      console.warn("NO OVERLAPPING SELECTIONS!");
      this.setState({widgetStyle: null});
    } else {
      this.savedSelection = serializeSelection.save(this.articleElement);
      const rect = getSelectionRect(selection);
      const pwRect = this.parentRect;

      this.setState({
        widgetStyle: {
          top: `${rect.bottom - pwRect.top}px`,
          left: `${rect.left - pwRect.left}px`
        }
      });
    }
  }

  restoreAnnotations() {
    if (this.state.needToLoadAnnotations) {
      hypothesisStore.fetch(this.props.documentId).then((response) => {
        const newPreload = response.rows.map(dbEntryToPreload);

        for (const entry of newPreload) {
          this.highlightEntry(entry);
        }
        this.setState({
          preload: newPreload
        });
      });
      this.setState({
        needToLoadAnnotations: false
      });
    }
  }

  highlightAndClose() {
    return this.saveAnnotation().then((response) => {
      this.setState({widgetStyle: null});
      this.highlightEntry(response);
      return response;
    });
  }

  openAnnotator() {
    return this.highlightAndClose().then((response) => {
      this.setState({activeHighlight: response});
    });
  }

  updateActiveAnnotation(event) {
    const newValue = event.target.value;

    this.setState({
      activeHighlight: Object.assign(
        {},
        this.state.activeHighlight,
        {annotation: newValue}
      )
    });
  }

  updateAnnotation() {
    const oldEntry = this.state.preload.find((e) => e.savedId === this.state.activeHighlight.savedId);

    this.setState({activeHighlight: null});
    window.getSelection().empty();
    if (oldEntry.annotation !== this.state.activeHighlight.annotation) {
      hypothesisStore.update(this.state.activeHighlight.savedId, this.state.activeHighlight.annotation).then((response) => {
        const newPreload = this.state.preload.slice();
        const oldEntry = newPreload.find((e) => e.savedId === response.id);

        Object.assign(oldEntry, dbEntryToPreload(response));
        this.setState({
          preload: newPreload
        });
        return oldEntry;
      });
    }
  }

  saveAnnotation() {
    window.getSelection().empty();

    return hypothesisStore.save(this.props.documentId, this.savedSelection, '')
      .then((response) => {
        const newEntry = dbEntryToPreload(response);
        const newPreload = this.state.preload.slice();

        newPreload.push(newEntry);
        this.setState({
          preload: newPreload
        });
        return newEntry;
      });
  }

  deleteEntry() {
    this.unhighlightEntry(this.state.activeHighlight);
    hypothesisStore.delete(this.state.activeHighlight.savedId).then((response) => {
      const oldIndex = this.state.preload.findIndex((e) => e.savedId === response.id);
      const newPreload = this.state.preload.slice();

      newPreload.splice(oldIndex, 1);
      this.setState({
        preload: newPreload
      });
    });
    this.setState({
      activeHighlight: null
    });
    window.getSelection().empty();
  }

  nextAnnotationInSortedList(entries) {
    const nextIndex = 1 + entries.findIndex((e) => e.selection.start === this.state.activeHighlight.selection.start);

    if (nextIndex < entries.length) {
      this.setState({activeHighlight: entries[nextIndex]});
      serializeSelection.restore(entries[nextIndex].selection, this.articleElement);
    }
  }

  nextAnnotation() {
    const entries = this.state.preload.sort((a, b) => a.selection.start - b.selection.start);

    this.nextAnnotationInSortedList(entries);
  }

  previousAnnotation() {
    // The trick is that the sort is reversed
    const entries = this.state.preload.sort((a, b) => b.selection.start - a.selection.start);

    this.nextAnnotationInSortedList(entries);
  }

  getParentRect(el) {
    if (el) {
      const wLeft = window.pageXOffset || document.documentElement.scrollLeft;
      const wTop = window.pageYOffset || document.documentElement.scrollTop;
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
    return (
      <div className="annotater" ref={this.getParentRect.bind(this)}>
        <HighlightWidget
          style={this.state.widgetStyle}
          annotate={this.openAnnotator.bind(this)}
          highlight={this.highlightAndClose.bind(this)}
        />
        <EditBox
          show={this.state.activeHighlight ? 'open' : 'closed'}
          annotation={this.state.activeHighlight ? this.state.activeHighlight.annotation : ''}
          updateAnnotation={this.updateActiveAnnotation.bind(this)}
          save={this.updateAnnotation.bind(this)}
          delete={this.deleteEntry.bind(this)}
          next={this.nextAnnotation.bind(this)}
          previous={this.previousAnnotation.bind(this)}
        />
        <SidebarButtons items={this.state.preload}
          offsetTop={this.parentRect ? this.parentRect.top : 0}
          onClick={(item) => this.setState({activeHighlight: item})}
        />
      </div>
    );
  }

}
