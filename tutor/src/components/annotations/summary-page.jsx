import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import { autobind } from 'core-decorators';
import SectionsFilter from './sections-filter';
import AnnotationCard from './annotation-card';

@observer
export default class AnnotationSummaryPage extends React.Component {

  static propTypes = {
    annotations: React.PropTypes.array.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    currentChapter: React.PropTypes.number.isRequired,
  };

  @computed get displayedChaptersSorted() {
    return this.displayedChapters.sort((a, b) => a - b);
  }

  @computed get annotationsFromThisBook() {
    return this.props.annotations
      .filter(e => e.selection.chapter)
      .sort((a, b) => (
        (a.selection.chapter - b.selection.chapter) ||
          (a.selection.section - b.selection.section) ||
          (a.selection.start - b.selection.start)
      ));
  }

  // unique list of pages that contain highlights
  @computed get highlightedPages() {
    const s = new Set(this.annotationsFromThisBook.map(this.chapterAndSection));
    return Array.from(s).sort();
  }

  @observable _displayedChapters;

  @computed get displayedChapters() {
    return this._displayedChapters || this.highlightedPages;
  }

  set displayedChapters(values) { this._displayedChapters = values; }

  // The pages whose highlights/annotations get displayed
  @computed get selectedHighlightedPages() {
    return this.highlightedPages
      .filter(ch => {
        return this.displayedChapters.includes(ch) //ch => ch === m[0]);
      });
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
    this.displayedChapters = values;
  }

  render() {
    return (
      <div className="summary-page">
        <div className="filter-area">
          <SectionsFilter
            pages={this.highlightedPages}
            selectedChapters={this.displayedChaptersSorted}
            setSelectedChapters={this.setSelectedChapters}
          />
        </div>
        <div className="annotations">
          {
            this.selectedHighlightedPages.map((ch, i) =>
              <div key={i}>
                <h1>{ch}</h1>
                {this.annotationsFromThisBook
                  .filter((e) => this.chapterAndSection(e) === ch)
                  .map((annotation) => (
                    <AnnotationCard
                      key={annotation.id}
                      annotation={annotation}
                      onDelete={this.props.onDelete}
                    />
                  ))}
              </div>
            )
          }
        </div>
      </div>
    );
  }

}
