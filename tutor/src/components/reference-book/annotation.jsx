import React from 'react';
import serializeSelection from 'serialize-selection';
import './highlighter';
import HYPOTHESIS from '../../models/hypothesis';
import hypothesisStore from './hypothesis-store';

const highlighter = new TextHighlighter(document.body);

let currentDocumentId;
let preload;
let active;

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

function unhighlightLatestEntry() {
  const highlights = highlighter.getHighlights({grouped: true});
  const lastHighlight = highlights.reduce((a, b) => a.timestamp > b.timestamp ? a : b);

  for (const el of lastHighlight.chunks) {
    highlighter.removeHighlights(el);
  }
}

export default class AnnotationWidget extends React.PureComponent {

  static restoreAnnotations(documentId) {
    if (documentId !== currentDocumentId) {
      console.debug("Calling FETCH");
      hypothesisStore.fetch(documentId).then((response) => {
        preload = response.rows.map(dbEntryToPreload);
        for (const entry of preload) {
          highlightEntry(entry);
        }
      });
      currentDocumentId = documentId;
    }
  }

  static handleAnnotationClick(event) {
    let el = event.target;
    while (el !== document && el.tagName !== 'TUTOR-HIGHLIGHT') {
      el = el.parentNode
    }
    if (el.tagName == 'TUTOR-HIGHLIGHT') {
      const start = serializeSelection.save().start;
      active = preload.find((entry) => {
        const sel = entry.selection;

        return sel.start <= start && sel.end >= start;
      });

      // Set selection, which will cause the widget to render
      if (active) {
        serializeSelection.restore(active.selection);
      }
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      highlighting: false,
      annotation: ''
    };
  }

  highlightSelection(event) {
    const whether = event.target.checked;
    const currentSelectionIsCollapsed = window.getSelection().isCollapsed;

    this.setState({highlighting: whether});
    if (whether) {
      if (this.savedSelection) {
        serializeSelection.restore(this.savedSelection);
      } else {
        this.savedSelection = serializeSelection.save();
        this.props.onHighlight(true);
      }
      highlighter.doHighlight(true);
    } else {
      this.savedSelection = serializeSelection.save();
      unhighlightLatestEntry();
      // this.props.onHighlight(false);
    }

    if (this.savedSelection) {
      serializeSelection.restore(this.savedSelection);
    }
  }

  updateAnnotation(event) {
    const newValue = event.target.value;

    this.setState({
      annotation: newValue
    });
  }

  isAnnotated() {
    return this.state.annotation.length > 0;
  }

  serializedSelection() {
    return this.savedSelection ?
      JSON.stringify({
        start: this.savedSelection.start,
        end: this.savedSelection.end
      }) :
      '';
  }

  saveAnnotation(event) {
    if (active) {
      hypothesisStore.update(active.savedId, this.state.annotation).then((response) => {
        console.debug("UPDATED", response);
        const oldEntry = preload.find((e) => e.savedId === response.id);

        Object.assign(oldEntry, dbEntryToPreload(response));
      });
    }
    else {
      hypothesisStore.save(currentDocumentId, this.savedSelection, this.state.annotation)
      .then((response) => {
        console.debug("SAVED", response);
        preload.push(dbEntryToPreload(response));
      });
    }
    // store.save(this.props.documentId, this.serializedSelection(), this.state.annotation);
    this.props.onHighlight(false);
    window.getSelection().empty();
  }

  deleteEntry(event) {
    unhighlightLatestEntry();
    hypothesisStore.delete(active.savedId).then((response) => {
      console.debug("That baby is gone", response);
      const oldIndex = preload.findIndex((e) => e.savedId === response.id);

      preload.splice(oldIndex, 1);
    });
    active = null;
    this.props.onHighlight(false);
    window.getSelection().empty();
  }

  componentDidMount() {
    if (active) {
      // Click the highlight checkbox
      this.checkThe(this.refs.cb);
      this.setState({annotation: active.annotation});
    }
  }

  componentWillUnmount() {
    // If there was no save, restore highlight
    if (active) {
      highlightEntry(active);
    }
    active = null;
  }

  checkThe(el) {
    el.checked = true;
    this.highlightSelection({target: el});
  }

  renderTextBox() {
    return this.state.highlighting ?
      <div className="control-group">
        <textarea value={this.state.annotation} name="text" onChange={this.updateAnnotation.bind(this)}></textarea>
      </div>
    : null;
  }

  renderSaveButton() {
    return this.state.highlighting ?
      <div className="control-group">
        <button onClick={this.saveAnnotation.bind(this)}>Save</button>
      </div> : null
  }

  renderDeleteButton() {
    return active ?
      <div className="control-group">
        <button onClick={this.deleteEntry.bind(this)}>Delete</button>
      </div> : null
  }

  render() {
    return <div className="annotater">
      <div className="control-group">
        <label>
          Highlight
          <input ref="cb" type="checkbox" onChange={this.highlightSelection.bind(this)} disabled={this.isAnnotated()}/>
        </label>
      </div>
      {this.renderTextBox()}
      {this.renderSaveButton()}
      {this.renderDeleteButton()}
    </div>;
  }

}
