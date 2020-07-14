import PropTypes from 'prop-types';
import React from 'react';
import { defaults, filter, map } from 'lodash';
import classnames from 'classnames';
import Exercise from '../../models/exercises/exercise';
import { observer } from 'mobx-react';
import { computed, action, observable } from 'mobx';
import TagModel from 'shared/model/exercise/tag';
import { Icon } from 'shared';
import Error from './error';
import Wrapper from './wrapper';

const TYPE = 'aplo';
import BookSelection from './book-selection';

const BOOKS = {
  'stax-apbio': {
    r: /^[A-Z]{3}-\d.[A-Z]$/,
    pattern: '[A-Z]{3}-#.[A-Z]',
    disallowed: /[^0-9A-Z.-]/g,
  },
  'stax-apphys': {
    r: /^\d\.[A-Z]\.\d\.\d$/,
    pattern: '#.[A-Z].#.#',
    disallowed: /[^0-9A-Z.]/g,
  },
};

@observer
class Input extends React.Component {
  static propTypes = {
    exercise: PropTypes.instanceOf(Exercise).isRequired,
    tag: PropTypes.instanceOf(TagModel).isRequired,
  };

  @observable errorMsg;
  @observable value = this.props.tag.value;

  @computed get book() {
    const { specifier } =  this.props.tag;
    if (specifier && this.availableBooks.includes(specifier)) {
      return specifier;
    }
    return null;
  }

  @computed get lo() {
    return this.props.tag.value;
  }

  @computed get validation() {
    return this.book && BOOKS[this.book];
  }

  @action.bound onTextChange(ev) {
    this.value = ev.target.value.replace(this.validation.disallowed, '');
    this.errorMsg = null;
  }

  isLoValid(book, lo) {
    if (!lo || !this.validation) { return true; } // LO is not required
    return lo.match( this.validation.r );
  }

  @action.bound validateAndSave(attrs) {
    if (attrs == null) { attrs = {}; }
    const { validation, props: { tag } } = this;
    const { lo, book } = defaults(attrs, { book: this.book, lo: this.lo });

    if (!book || !this.isLoValid(book, lo)) {
      this.errorMsg = 'Must have book';
      if (book) {
        this.errorMsg += ` and match APLO pattern of ${validation.pattern}`;
      }
    } else {
      tag.value = lo;
    }
    tag.specifier = book;

  }

  @action.bound onTextBlur() {
    return this.validateAndSave({ lo: this.value });
  }

  @action.bound updateBook(ev) {
    this.errorMsg = this.value = '';
    this.validateAndSave({ book: ev.target.value });
  }

  @action.bound onDelete() {
    this.props.exercise.tags.remove(this.props.tag);
  }

  @computed get availableBooks() {
    return filter(
      map(this.props.exercise.tags.withType('book', { multiple: true }), 'value'),
      b => !!BOOKS[b]
    );
  }


  render() {
    const { validation } = this;

    return (
      <div className={classnames('tag', { 'has-error': this.errorMsg })}>
        <BookSelection
          onChange={this.updateBook}
          selected={this.book}
          limit={this.availableBooks}
        />
        {validation &&
          <input
            className="form-control"
            type="text"
            onChange={this.onTextChange}
            onBlur={this.onTextBlur}
            value={this.value}
            placeholder={validation.pattern}
          />}
        <Error error={this.errorMsg} />
        <span className="controls">
          <Icon type="trash" onClick={this.onDelete} />
        </span>
      </div>
    );
  }
}

@observer
class ApLoTags extends React.Component {
  static propTypes = {
    exercise: PropTypes.instanceOf(Exercise).isRequired,
  };

  @action.bound onAdd() {
    this.props.exercise.tags.push({ type: TYPE, value: '' });
  }

  render() {
    const { exercise } = this.props;

    const tags = exercise.tags.withType(TYPE, { multiple: true });

    if (!exercise.tags.find(t => !!BOOKS[t.value])) {
      return null;
    }

    return (
      <Wrapper label="AP LO" onAdd={this.onAdd}>
        {tags.map((tag, i) =>
          <Input key={i} {...this.props} tag={tag} />)}
      </Wrapper>
    );
  }
}

export default ApLoTags;
