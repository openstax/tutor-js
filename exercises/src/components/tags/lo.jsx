import React from 'react';
import { defaults } from 'lodash';
import classnames from 'classnames';
import Exercise from '../../models/exercises/exercise';
import { observer } from 'mobx-react';
import { computed, action, observable } from 'mobx';
import TagModel from 'shared/model/exercise/tag';

import Error from './error';
import Wrapper from './wrapper';

const PREFIX = 'lo';
import BookSelection from './book-selection';

@observer
class Input extends React.Component {
  static propTypes = {
    exercise: React.PropTypes.instanceOf(Exercise).isRequired,
    tag: React.PropTypes.instanceOf(TagModel).isRequired,
  };

  static defaultProps = { inputType: 'text' };

  @computed get book() {
    return this.props.tag.type;
  }

  @computed get lo() {
    return this.props.tag.value;
  }

  state = {};
  // constructor(props) {
  //   super(props);

  //   const [book, lo] = Array.from(props.tag.split(':'));
  //   this.state = { book, lo };
  // }

  validateInput = (value) => {
    if (!value.match(
      /^\d{1,2}-\d{1,2}-\d{1,2}$/
    )) { return 'Must match LO pattern of dd-dd-dd'; }
  };


  // componentWillReceiveProps(nextProps) {
  //   const [book, lo] = Array.from(this.props.tag.split(':'));
  //   return (
  //     this.setState({ book, lo })
  //   );
  // }

  onTextChange = (ev) => {
    const lo = ev.target.value.replace(/[^0-9\-]/g, '');
    return (
      this.setState({ errorMsg: null, lo })
    );
  };

  validateAndSave = (attrs) => {
    if (attrs == null) { attrs = {}; }
    const { tag } = this.props;
    const { lo, book } = defaults(attrs, { book: this.book, lo: this.lo })
    if (book && (lo != null ? lo.match( /^\d{1,2}-\d{1,2}-\d{1,2}$/ ) : undefined)) {
      tag.specifier = book;
      tag.value = lo;
    } else {
      this.setState({ errorMsg: 'Must match LO pattern of book:dd-dd-dd' });
    }
  };

  onTextBlur = () => { return this.validateAndSave(); };

  updateBook = (ev) => {
    const book = ev.target.value;
    this.validateAndSave({ book })
  };

  onDelete = () => {
    this.props.actions.setPrefixedTag(this.props.id,
      { prefix: PREFIX, tag: false, previous: this.props.tag }
    );
  };

  render() {

    const { exercise } = this.props;

    return (
      <div className={classnames('tag', { 'has-error': this.state.errorMsg })}>
        <BookSelection
          onChange={this.updateBook}
          selected={this.state.book}
          limit={exercise.tagsWithPrefix('book')} />
        <input
          className="form-control"
          type={this.props.inputType}
          onChange={this.onTextChange}
          onBlur={this.onTextBlur}
          value={this.state.lo}
          placeholder={this.props.placeholder} />
        <Error error={this.state.errorMsg} />
        <span className="controls">
          <i onClick={this.onDelete} className="fa fa-trash" />
        </span>
      </div>
    );
  }
}

class LoTags extends React.Component {
  static propTypes = {
    exercise: React.PropTypes.instanceOf(Exercise).isRequired,
  };

  @action.bound onAdd() {
    this.props.exercise.addBlankPrefixedTag({ prefix: PREFIX });
  }

  render() {
    const tags = this.props.exercise.tagsWithPrefix(PREFIX);

    return (
      <Wrapper label="LO" onAdd={this.onAdd}>
        {tags.map((tag) =>
          <Input key={tag.asString} {...this.props} tag={tag} />)}
      </Wrapper>
    );
  }
}

export default LoTags;
