import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { isEmpty, map } from 'lodash';
import { action, observable, computed } from 'mobx';
import { Button } from 'react-bootstrap';
import { Icon } from 'shared';
import Courses from '../../models/courses-map';
import PopoutWindow from 'shared/components/popout-window';
import { ArbitraryHtmlAndMath } from 'shared';
import Analytics from '../../helpers/analytics';

export default
@observer
class SummaryPopup extends React.Component {

  static propTypes = {
    windowImpl: PropTypes.shape({
      open: PropTypes.func,
    }),
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
    return null;

    const { notes } = this.props;
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
              {map(notes, (notes, ch) =>
                <div key={ch}>
                  <h2>{notes[0].formattedChapterSection} {notes[0].title}</h2>
                  {map(notes, (note) => (
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
                        {note.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PopoutWindow>
      </div>
    );
  }
};
