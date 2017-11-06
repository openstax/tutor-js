import React from 'react';
import serializeSelection from 'serialize-selection';
import './highlighter';
import HYPOTHESIS from '../../models/hypothesis';
import hypothesisStore from './hypothesis-store';
import _ from 'underscore';

const highlighter = new TextHighlighter(document.body);

let preload;

function dbEntryToPreload(entry) {
  return {
    savedId: entry.id,
    annotation: entry.text,
    selection: entry.target[0].selector[0]
  };
}

function highlightEntry(entry) {
  serializeSelection.restore(entry.selection);
  highlighter.doHighlight();
}

function unhighlightEntry(entry) {
  // Highlight the entry, then unhighlight the highlights with the latest timestamp
  highlightEntry(entry);
  const highlights = highlighter.getHighlights({grouped: true});
  const lastHighlight = highlights.reduce((a, b) => a.timestamp > b.timestamp ? a : b);

  for (const el of lastHighlight.chunks) {
    highlighter.removeHighlights(el);
  }
}

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
          <button aria-label="previous annotation">
            <i className="fa fa-chevron-up" role="button" ></i>
          </button>
          <button aria-label="next annotation">
            <i className="fa fa-chevron-down" role="button" ></i>
          </button>
          <button>See all</button>
        </div>
      </div>
    </div>
  );
}

export default class AnnotationWidget extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      activeHighlight: null,
      widgetStyle: {display: 'none'}
    };
    // This is state that only affects post-rendering processes, so not proper state
    this.needToLoadAnnotations = true;
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
    this.needToLoadAnnotations = nextProps.documentId !== this.props.documentId
  }

  componentDidUpdate() {
    this.restoreAnnotations();
  }

  componentWillUnmount() {
    window.document.removeEventListener('selectionchange', this.handleSelectionChange)
  }

  findOverlap() {
    const selection = serializeSelection.save();
    const start = selection.start;
    const end = selection.end;

    return preload.find((entry) => {
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
      const start = serializeSelection.save().start;
      this.setState({
        activeHighlight: preload.find((entry) => {
          const sel = entry.selection;

          return sel.start <= start && sel.end >= start;
        })
      });

      // Set selection, which will cause the widget to render
      if (this.state.activeHighlight) {
        serializeSelection.restore(this.state.activeHighlight.selection);
      }
    } else if (this.findOverlap()){
      console.warn("NO OVERLAPPING SELECTIONS!");
      this.setState({widgetStyle: null});
    } else {
      this.savedSelection = serializeSelection.save();
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      const pwRect = document.querySelector('.paged-content .page-wrapper').getBoundingClientRect();

      this.setState({
        widgetStyle: {
          top: `${rect.bottom - pwRect.top}px`,
          left: `${rect.left}px`
        }
      });
    }
  }

  restoreAnnotations() {
    if (this.needToLoadAnnotations) {
      hypothesisStore.fetch(this.props.documentId).then((response) => {
        preload = response.rows.map(dbEntryToPreload);
        for (const entry of preload) {
          highlightEntry(entry);
        }
      });
      this.needToLoadAnnotations = false;
    }
  }

  renderWidget() {
    return (this.state.widgetStyle) ?
      <div className="widget arrow_box" style={this.state.widgetStyle}>
        <i className="fa fa-comment" role="button" alt="annotate" onClick={this.openAnnotator.bind(this)}></i>
        <i className="fa fa-pencil" role="button" alt="highlight" onClick={this.highlightAndClose.bind(this)}></i>
      </div>
    : null;
  }

  highlightAndClose() {
    highlighter.doHighlight(true);
    return this.saveAnnotation().then((response) => {
      this.setState({widgetStyle: null});
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
        {
          annotation: newValue
        }
      )
    });
  }

  updateAnnotation() {
    const oldEntry = preload.find((e) => e.savedId === this.state.activeHighlight.savedId);

    this.setState({activeHighlight: null});
    window.getSelection().empty();
    if (oldEntry.annotation !== this.state.activeHighlight.annotation) {
      hypothesisStore.update(this.state.activeHighlight.savedId, this.state.activeHighlight.annotation).then((response) => {
        const oldEntry = preload.find((e) => e.savedId === response.id);

        Object.assign(oldEntry, dbEntryToPreload(response));
        console.debug("Updated values:", oldEntry);
        return oldEntry;
      });
    }
  }

  saveAnnotation() {
    window.getSelection().empty();

    return hypothesisStore.save(this.props.documentId, this.savedSelection, '')
      .then((response) => {
        const newEntry = dbEntryToPreload(response);

        console.debug("SAVED", newEntry);
        preload.push(newEntry);
        return newEntry;
      });
  }

  deleteEntry() {
    console.debug("Delete active", this.state.activeHighlight);
    // Ensure it's the last thing highlighted
    unhighlightEntry(this.state.activeHighlight);
    hypothesisStore.delete(this.state.activeHighlight.savedId).then((response) => {
      const oldIndex = preload.findIndex((e) => e.savedId === response.id);

      preload.splice(oldIndex, 1);
    });
    this.setState({
      activeHighlight: null
    });
    window.getSelection().empty();
  }

  render() {
    return <div className="annotater">
      {this.renderWidget()}
      <EditBox
        show={this.state.activeHighlight ? 'open' : 'closed'}
        annotation={this.state.activeHighlight ? this.state.activeHighlight.annotation : ''}
        updateAnnotation={this.updateActiveAnnotation.bind(this)}
        save={this.updateAnnotation.bind(this)}
        delete={this.deleteEntry.bind(this)}
      />
    </div>;
  }

}
