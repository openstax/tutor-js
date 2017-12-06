import React from 'react';
import Multiselect from '../multi-select';
import { observer } from 'mobx-react';
import { action, computed } from 'mobx';
import { filter } from 'lodash';

@observer
export default class SectionsFilter extends React.Component {

  static propTypes = {
    pages: React.PropTypes.array.isRequired,
    selectedChapters: React.PropTypes.array.isRequired,
    setSelectedChapters: React.PropTypes.func.isRequired,
  };

  @action.bound
  setChapter(choice) {
    this.props.setSelectedChapters(
      choice.selected ?
        filter(this.props.selectedChapters, c => c !== choice.id) :
        this.props.selectedChapters.concat(choice.id)
    );
  }

  @computed get choices() {
    return this.props.pages.map(title => (
      { title, id: title, selected: this.props.selectedChapters.includes(title) }
    ));
  }

  render() {
    return (
      <div className="filter-widget">
        <Multiselect
          title="Display sections"
          onSelect={this.setChapter}
          data={this.props.pages}
          selections={this.choices}
        />
      </div>
    );
  }

}
