import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import Wrapper from './wrapper';
import BookSelection from './book-selection';
import Exercise from '../../models/exercises/exercise';
import TagModel from 'shared/model/exercise/tag';


@observer
class BookTagSelect extends React.Component {
  static propTypes = {
    tag: React.PropTypes.instanceOf(TagModel).isRequired,
    exercise: React.PropTypes.instanceOf(Exercise).isRequired,

  };

  @action.bound updateTag(ev) {
    this.props.exercise.tags.setUniqueValue(this.props.tag, ev.target.value);
  }

  @action.bound onDelete() {
    this.props.exercise.tags.remove(this.props.tag);
  }

  render() {
    return (
      <div className="tag">
        <BookSelection
          onChange={this.updateTag}
          selected={this.props.tag.value}
        />
        <span className="controls">
          <i onClick={this.onDelete} className="fa fa-trash" />
        </span>
      </div>
    );
  }
}

@observer
export default class BookTags extends React.Component {
  static propTypes = {
    exercise: React.PropTypes.instanceOf(Exercise).isRequired,
  };

  @action.bound add() {
    this.props.exercise.tags.push({ type: 'book' });
  }

  render() {
    const tags = this.props.exercise.tags.withType('book', { multiple: true });
    return (
      <Wrapper label="Book" onAdd={this.add} singleTag={tags.length === 1}>
        {tags.map((tag) =>
          <BookTagSelect key={tag.asString} {...this.props} tag={tag} />)}
      </Wrapper>
    );
  }
}
