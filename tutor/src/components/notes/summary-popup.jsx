import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { Button } from 'react-bootstrap';
import { Icon } from 'shared';
import PopoutWindow from 'shared/components/popout-window';
import { ArbitraryHtmlAndMath } from 'shared';
import Analytics from '../../helpers/analytics';

const NotesForSection = observer(({
  notes, section, selectedSections,
}) => {
  if (!selectedSections.includes(section.chapter_section.key)) {
    return null;
  }
  const page = notes.forChapterSection(section.chapter_section);
  return (
    <div className="section">
      <h2>
        {section.chapter_section.asString}
        {section.title}
      </h2>
      {page.notesByPagePosition.map((note) => (
        <div
          key={note.id}
          style={{
            marginBottom: '2rem',
          }}
        >
          <blockquote
            style={{
              fontStyle: 'italic',
              margin: '0 0 1rem 0.5rem',
              borderLeft: '2px solid lightgrey',
              paddingLeft: '0.5rem',
            }}
          >
            <ArbitraryHtmlAndMath html={note.content} />
          </blockquote>
          <p
            style={{
              marginLeft: '0.5rem',
            }}
          >
            {note.annotation}
          </p>
        </div>
      ))}
    </div>
  );
});
NotesForSection.displayName = 'NotesForSection';

export default
@observer
class SummaryPopup extends React.Component {

  static propTypes = {
    windowImpl: PropTypes.shape({
      open: PropTypes.func,
    }),
    selected: PropTypes.array.isRequired,
    notes: PropTypes.object.isRequired,
  };

  @observable isOpen = false;

  static defaultProps = {
    windowImpl: window,
  }

  componentDidMount() {
    Analytics.sendPageView('/notes/print');
  }

  @action.bound onSummaryWindowClose() {
    this.isOpen = false;
  }

  @action.bound openSummaryWindow() {
    this.isOpen = true;
    this.popup.open();
  }

  @action.bound onPopupReady(popup) {
    this.popup = popup;
    // give math a bit of time to render
    setTimeout(() => this.popup.print(), 100);
  }

  render() {
    const { notes, selected } = this.props;

    if (!notes) { return null; }

    const { course } = notes;

    return (
      <div>
        <Button
          className="print-btn"
          variant="default"
          onClick={this.openSummaryWindow}
        >
          <Icon type="print"/> Print this page
        </Button>
        <PopoutWindow
          title={`${course.name} highlights and notes`}
          onReady={this.onPopupReady}
          ref={pw => (this.popup = pw)}
          windowImpl={this.props.windowImpl}
          onClose={this.onSummaryWindowClose}
          options={{
            height: 500,
            width: 700,
          }}
        >
          <div className="summary-preview summary-popup">
            <div className="notes">
              {notes.sections.sorted().map((s, i) =>
                <NotesForSection
                  key={i}
                  notes={notes}
                  selectedSections={selected}
                  section={s}
                />)}
            </div>
          </div>
        </PopoutWindow>
      </div>
    );
  }
}
