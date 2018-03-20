import React from 'react';
import { action } from 'mobx';
import Wrapper from './wrapper';
import BookSelection from './book-selection';
import Exercise from '../../models/exercises/exercise';
import TagModel from 'shared/model/exercise/tag';

class BookTagSelect extends React.Component {
  static propTypes = {
    book: React.PropTypes.instanceOf(TagModel).isRequired,
    exercise: React.PropTypes.instanceOf(Exercise).isRequired,
  };

  updateTag = (ev) => {
    return (
      this.props.actions.setTypeedTag(this.props.id,
        { type: 'book', tag: ev.target.value, previous: this.props.book }
      )
    );
  };

  onDelete = () => {
    this.props.actions.setTypeedTag(this.props.id,
      { type: 'book', tag: false, previous: this.props.book }
    );
    return (
      this.props.actions.setTypeedTag(this.props.id,
        { type: `exid:${this.props.book}`, tag: false, replaceOthers: true }
      )
    );
  };

  render() {
    return (
      <div className="tag">
        <BookSelection onChange={this.updateTag} selected={this.props.book} />
        <span className="controls">
          <i onClick={this.onDelete} className="fa fa-trash" />
        </span>
      </div>
    );
  }
}

class BookTags extends React.Component {
  static propTypes = {
    exercise: React.PropTypes.instanceOf(Exercise).isRequired,
  };

  @action.bound add() {
    this.props.exercise.addBlankTypeedTag({ type: 'book' });
  }

  render() {
    const tags = this.props.exercise.tags.withType('book', { multiple: true });
    return (
      <Wrapper label="Book" onAdd={this.add} singleTag={tags.length === 1}>
        {tags.map((tag) =>
          <BookTagSelect key={tag.asString} {...this.props} book={tag} />)}
      </Wrapper>
    );
  }
}


export default BookTags;
