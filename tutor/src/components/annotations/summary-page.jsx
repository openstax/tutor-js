import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import { autobind } from 'core-decorators';
import Icon from '../icon';
import cn from 'classnames';
import User from '../../models/user';
import Annotations from '../../models/annotations';
import SuretyGuard from 'shared/src/components/surety-guard';


const CheckBoxEntry = ({value, text, changeSelection, checked}) => (
  <label>
    <input type="checkbox" value={value}
      onChange={changeSelection}
      checked={checked}
    />
    {text}
  </label>
);

@observer
class FilterWidget extends React.Component {

  static propTypes = {
    pages: React.PropTypes.array.isRequired,
    selectedChapters: React.PropTypes.array.isRequired,
    setChapter: React.PropTypes.func.isRequired
  };

  @observable isOpen = false;

  @computed get parsedChapters() {
    const chapterNumbers = this.props.pages.map((ch) => {
      const m = ch.match(/^(\d+)(?:\.(\d+))?\s*(.*)/);

      return m[1];
    });
    const uniqueChapters = Array.from(new Set(chapterNumbers)).sort((a, b) => a - b);

    return uniqueChapters;
  }

  componentWillReceiveProps(newProps) {
    if (this.props.showing === false) {
      this.isOpen = false;
    }
  }

  @action.bound
  toggle() {
    this.isOpen = !this.isOpen;
  }

  @autobind
  toggleAll(event) {
    const whether = event.target.checked;

    if (whether) {
      for (const c of this.parsedChapters) {
        this.props.setChapter(c, true);
      }
    } else {
      for (const c of this.props.selectedChapters) {
        this.props.setChapter(c, false);
      }
    }
  }

  @autobind
  setChapter(event) {
    this.props.setChapter(event.target.value, event.target.checked);
  }

  render() {
    // console.debug("Selected:", this.props.selectedChapters);
    // console.debug("Parsed:", this.parsedChapters);
    return (
      <div className="filter-widget">
        <div className="selected-item" onClick={this.toggle}></div>

        <div className={cn('options-dropdown', { down: this.isOpen })}>
          <CheckBoxEntry
            value={-1}
            text={'All'}
            changeSelection={this.toggleAll}
            checked={this.props.selectedChapters.length === this.parsedChapters.length}
          />
          {
            this.parsedChapters.map((ch) => (
              <CheckBoxEntry key={ch}
                value={ch}
                text={`Chapter ${ch}`}
                changeSelection={this.setChapter}
                checked={!!this.props.selectedChapters.find(sc => sc === ch)}
              />
            ))
          }
        </div>
      </div>
    );
  }
}


@observer
class EditBox extends React.Component {

  @autobind
  callUpdateText() {
    this.props.save(this.refs.textarea.value);
    this.props.dismiss();
  }

  render() {
    const {show, text, save, dismiss} = this.props;

    return show ?
      <div className="edit-box">
        <textarea ref="textarea" defaultValue={text}></textarea>
        <button onClick={this.callUpdateText}><Icon type="check" /></button>
        <button onClick={dismiss}><Icon type="times" /></button>
      </div>
      :
      <div className="plain-text">
        {text}
      </div>
    ;
  }
}

@observer
class AnnotationCard extends React.Component {

  // static propTypes = {
  //   entry: React.PropTypes.object required
  //   doDelete: React.PropTypes.func.isRequired
  //   updateAnnotation: React.PropTypes.func.isRequired
  // };

  @observable editing = false;

  @action.bound
  startEditing() {
    this.editing = true;
  }

  @action.bound
  stopEditing() {
    this.editing = false;
  }

  @action.bound
  saveAnnotation(newText) {
    this.props.entry.text = newText;
    this.props.updateAnnotation(this.props.entry);
  }

  @autobind
  openPage() {
    const { courseId, chapter, section } = this.props.entry.selection;
    let url = `/books/${courseId}/section/${chapter}`;

    if (section) {
      url += `.${section}`;
    }

    window.open(url, '_blank');
  }

  render() {
    const {entry, doDelete, updateAnnotation} = this.props;

    return (
      <div className="annotation-card">
        <div className="annotation-content">
          <div className="selected-text">
            {entry.selection.content}
          </div>
          <EditBox
            show={this.editing}
            text={entry.text}
            dismiss={this.stopEditing}
            save={this.saveAnnotation}
          />
        </div>
        <div className="controls">
          <button onClick={this.startEditing}><Icon type="edit" /></button>
          <button onClick={this.openPage}><Icon type="external-link" /></button>
          <SuretyGuard
            title="Are you sure you want to delete this note?"
            message="If you delete this note, your work cannot be recovered."
            okButtonLabel="Delete"
            onConfirm={doDelete}
          >
            <button><Icon type="trash" /></button>
          </SuretyGuard>
        </div>
      </div>
    );
  }
}

@observer
export default class AnnotationSummaryPage extends React.Component {

  static propTypes = {
    items: React.PropTypes.array.isRequired,
    deleteEntry: React.PropTypes.func.isRequired,
    updateAnnotation: React.PropTypes.func.isRequired,
    currentChapter: React.PropTypes.number.isRequired
  };

  @observable displayedChapters = [];

  @computed get displayedChaptersSorted() {
    return this.displayedChapters.sort((a, b) => a - b);
  }

  @computed get annotationsFromThisBook() {
    return this.props.items
    .sort((a, b) => (
      (a.selection.chapter - b.selection.chapter) ||
      (a.selection.section - b.selection.section) ||
      (a.selection.start - b.selection.start)
    ))
    .filter(e => e.selection.chapter);
  };

  // unique list of pages that contain highlights
  @computed get highlightedPages() {
    const s = new Set(this.annotationsFromThisBook.map(this.chapterAndSection));

    return Array.from(s).sort();
  };

  // The pages whose highlights/annotations get displayed
  @computed get selectedHighlightedPages() {
    return this.highlightedPages
    .filter(ch => {
      // Match the chapter number in the chapter-section-title string
      const m = ch.match(/^\d+/);

      return this.displayedChapters.find(ch => ch === m[0]);
    });
  }

  componentWillMount() {
    this.displayedChapters.push(this.props.currentChapter.toString());
  }

  componentWillReceiveProps(newProps) {
    if (this.props.currentChapter !== newProps.currentChapter) {
      this.displayedChapters.push(newProps.currentChapter.toString());
    }
  }

  chapterAndSection(entry) {
    const {chapter, section, title} = entry.selection;
    let result = chapter;

    if (section) {
      result += `.${section}`;
    }
    result += ` ${title}` || ' (no title)';

    return result;
  }

  @action.bound
  setSelectedChapters(values) {
    this.displayedChapters.replace(values.map(v => [v, true]));
  }

  @action.bound
  setChapter(chapterNumber, whether) {
    if (whether) {
      if (!this.displayedChapters.find(c => c === chapterNumber)) {
        this.displayedChapters.push(chapterNumber);
      }
    } else {
      this.displayedChapters = this.displayedChapters.filter(c => c !== chapterNumber);
    }
  }

  render() {
    return (
      <div className="summary-page">
        <div className="filter-area">
          <FilterWidget
            pages={this.highlightedPages}
            selectedChapters={this.displayedChaptersSorted}
            setChapter={this.setChapter}
            showing={this.props.showing}
          />
        </div>
        <div className="annotations">
          {
            this.selectedHighlightedPages
            .map((ch) =>
              <div key={ch}>
                <h1>{ch}</h1>
                {
                  this.annotationsFromThisBook
                  .filter((e) => this.chapterAndSection(e) === ch)
                  .map((entry) => (
                    <AnnotationCard key={entry.selection.start}
                      entry={entry}
                      doDelete={() => this.props.deleteEntry(entry.savedId)}
                      updateAnnotation={this.props.updateAnnotation}
                    />
                  ))
                }
              </div>
            )
          }
        </div>
      </div>
    );
  }

}
