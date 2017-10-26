import React from 'react';
import serializeSelection from 'serialize-selection';
import './highlighter';
import HYPOTHESIS from '../../models/hypothesis';

const highlighter = new TextHighlighter(document.body);

const _store = {};
const store = {
  save: (documentId, selection, annotation) => {
    if (!(documentId in _store)) {
      _store[documentId] = [];
    }

    _store[documentId][selection] = {
      selection,
      annotation
    };
  },
  getAnnotationsForDocument: (documentId) => {
    return Object.values(_store[documentId] || {});
  }
};

let currentDocumentId;
let preload;

export default class AnnotationWidget extends React.PureComponent {

  static restoreAnnotations(documentId) {
    if (documentId !== currentDocumentId) {
      const annotations = store.getAnnotationsForDocument(documentId);

      for (const entry of annotations) {
        serializeSelection.restore(JSON.parse(entry.selection));
        highlighter.doHighlight();
      }
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
      const annotations = store.getAnnotationsForDocument(currentDocumentId);
      const match = annotations.find((entry) => {
        const sel = JSON.parse(entry.selection);

        return sel.start <= start && sel.end >= start;
      });

      preload = match;
      // Set selection, which will cause the widget to render
      serializeSelection.restore(JSON.parse(match.selection))
    }
  }


  constructor(props) {
    super(props);
    this.state = {
      highlighting: false,
      annotated: false,
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
      const highlights = highlighter.getHighlights({grouped: true});
      const lastHighlight = highlights.reduce((a, b) => a.timestamp > b.timestamp ? a : b);

      this.savedSelection = serializeSelection.save();
      for (const el of lastHighlight.chunks) {
        highlighter.removeHighlights(el);
      }
      this.props.onHighlight(false);
    }

    if (this.savedSelection) {
      serializeSelection.restore(this.savedSelection);
    }
  }

  updateAnnotation(event) {
    const newValue = event.target.value;

    this.setState({
      annotation: newValue,
      annotated: newValue.length > 0
    });
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
    event.preventDefault();
    store.save(this.props.documentId, this.serializedSelection(), this.state.annotation);
    this.props.onHighlight(false);
    window.getSelection().empty();
  }

  componentDidMount() {
    if (this.preload) {
      // Click the highlight checkbox
      this.checkThe(this.refs.cb);
      this.setState({annotation: this.preload.annotation});
    }
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
        <button type="submit">Save</button>
      </div> : null
  }

  render() {
    const hypothesisConfig = HYPOTHESIS.sidebarConfig().services[0];

    // Gets a value on first render only
    this.preload = preload;
    preload = null;

    return <div className="annotater">
      <form action={hypothesisConfig.apiUrl + 'token'} method="post"
        onSubmit={this.saveAnnotation.bind(this)}>
        <input type="hidden" name="uri" />
        <input type="hidden" name="target" value={this.serializedSelection()} />
        <input type="hidden" name="assertion" value="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjcuMC4wLjEiLCJpc3MiOiJkNjE2NzU2YS1iNDI3LTExZTctYjI4MS1hMzlkZDY3NjE3NzAiLCJzdWIiOiJhY2N0OjcwODY2Mjk0OUBvcGVuc3RheC5vcmciLCJuYmYiOjE1MDg4NTQ0NDIsImV4cCI6MTUwODg1NTA0Mn0.6vWNDMULqthN3bndolsscIlHF7EtBNRdavWxXvMTu-g" />
        <input type="hidden" name="grant_type" value="urn:ietf:params:oauth:grant-type:jwt-bearer" />
        <input type="hidden" name="authority" value={hypothesisConfig.authority} />
        <div className="control-group">
          <label>
            Highlight
            <input ref="cb" type="checkbox" onChange={this.highlightSelection.bind(this)} disabled={this.state.annotated}/>
          </label>
        </div>
        {this.renderTextBox()}
        {this.renderSaveButton()}
      </form>
    </div>;
  }

}
