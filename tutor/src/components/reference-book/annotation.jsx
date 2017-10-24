import React from 'react';
import serializeSelection from 'serialize-selection';
import './highlighter';
import HYPOTHESIS from '../../models/hypothesis';

const highlighter = new TextHighlighter(document.body);

export default class AnnotationWidget extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      highlighting: false,
      annotated: false
    };
  }

  highlightSelection(event) {
    const whether = event.target.checked;
    const currentSelectionIsCollapsed = window.getSelection().isCollapsed;

    this.setState({highlighting: whether});
    if (whether) {
      if (this.savedSelection) {
        serializeSelection.restore(this.savedSelection);
        console.debug("Selection fixed at:", window.getSelection().toString());
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
    this.setState({annotated: event.target.value.length > 0})
  }

  serializedSelection() {
    return this.savedSelection ?
      JSON.stringify({
        start: this.savedSelection.start,
        end: this.savedSelection.end
      }) :
      '';
  }

  renderTextBox() {
    return this.state.highlighting ?
      <div className="control-group">
        <textarea name="text" onChange={this.updateAnnotation.bind(this)}></textarea>
      </div>
    : null;
  }

  renderSaveButton() {
    return <div className="control-group">
      <button type="submit">{this.state.highlighting ? 'Save' : 'Delete'}</button>
    </div>
  }

  render() {
    const hypothesisConfig = HYPOTHESIS.sidebarConfig().services[0];

    return <div className="annotater">
      <form action={hypothesisConfig.apiUrl + 'token'} method="post">
        <input type="hidden" name="uri" />
        <input type="hidden" name="target" value={this.serializedSelection()} />
        <input type="hidden" name="assertion" value="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjcuMC4wLjEiLCJpc3MiOiJkNjE2NzU2YS1iNDI3LTExZTctYjI4MS1hMzlkZDY3NjE3NzAiLCJzdWIiOiJhY2N0OjcwODY2Mjk0OUBvcGVuc3RheC5vcmciLCJuYmYiOjE1MDg4NTQ0NDIsImV4cCI6MTUwODg1NTA0Mn0.6vWNDMULqthN3bndolsscIlHF7EtBNRdavWxXvMTu-g" />
        <input type="hidden" name="grant_type" value="urn:ietf:params:oauth:grant-type:jwt-bearer" />
        <input type="hidden" name="authority" value={hypothesisConfig.authority} />
        <div className="control-group">
          <label>
            Highlight
            <input type="checkbox" onChange={this.highlightSelection.bind(this)} disabled={this.state.annotated}/>
          </label>
        </div>
        {this.renderTextBox()}
        {this.renderSaveButton()}
      </form>
    </div>;
  }

}
