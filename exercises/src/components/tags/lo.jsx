import PropTypes from 'prop-types';
import React from 'react';
import { defaults, map } from 'lodash';
import classnames from 'classnames';
import Exercise from '../../models/exercises/exercise';
import { observer } from 'mobx-react';
import { computed, action, observable } from 'mobx';
import TagModel from 'shared/model/exercise/tag';
import { Icon } from 'shared';
import Error from './error';
import Wrapper from './wrapper';

const TYPE = 'lo';
import BookSelection from './book-selection';

@observer
class Input extends React.Component {
  static propTypes = {
    exercise: PropTypes.instanceOf(Exercise).isRequired,
    tag: PropTypes.instanceOf(TagModel).isRequired,
  };

  @observable errorMsg;
  @observable value = this.props.tag.value;
  @computed get book() {
    return this.props.tag.specifier;
  }

  @computed get lo() {
    return this.props.tag.value;
  }

  @action.bound onTextChange(ev) {
    this.value = ev.target.value.replace(/[^0-9.-]/g, '');
    this.errorMsg = null;
  }

  @action.bound validateAndSave(attrs) {
    if (attrs == null) { attrs = {}; }
    const { tag } = this.props;
    const { lo, book } = defaults(attrs, { book: this.book, lo: this.lo });

    if (!book || (lo != null && !lo.match( /^\d{1,2}(-|\.)\d{1,2}(-|\.)\d{1,2}$/ ))) {
      this.errorMsg = 'Must have book and match LO pattern of dd-dd-dd';
    } else {
      tag.value = lo;
    }
    tag.specifier = book;

  }

  @action.bound onTextBlur() {
    return this.validateAndSave({ lo: this.value });
  }

  @action.bound updateBook(ev) {
    this.validateAndSave({ book: ev.target.value });
  }

  @action.bound onDelete() {
    this.props.exercise.tags.remove(this.props.tag);
  }

  render() {
    const { exercise } = this.props;

    return (
      <div className={classnames('tag', { 'has-error': this.errorMsg })}>
        <BookSelection
          onChange={this.updateBook}
          selected={this.book}
          limit={map(exercise.tags.withType('book', { multiple: true }), 'value')} />
        <input
          className="form-control"
          type="text"
          onChange={this.onTextChange}
          onBlur={this.onTextBlur}
          value={this.value}
          placeholder="##-##-##"
        />
        <Error error={this.errorMsg} />
        <span className="controls">
          <Icon type="trash" onClick={this.onDelete} />
        </span>
      </div>
    );
  }
}

@observer
class LoTags extends React.Component {
  static propTypes = {
    exercise: PropTypes.instanceOf(Exercise).isRequired,
  };

  @action.bound onAdd() {
    this.props.exercise.tags.push({ type: TYPE, value: '' });
  }

  render() {
    const tags = this.props.exercise.tags.withType(TYPE, { multiple: true });

    return (
      <Wrapper label="LO" onAdd={this.onAdd}>
        {tags.map((tag) =>
          <Input key={tag.asString} {...this.props} tag={tag} />)}
      </Wrapper>
    );
  }
}

export default LoTags;
