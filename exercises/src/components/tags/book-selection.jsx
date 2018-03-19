import React from 'react';
import { get, map, isEmpty, pick } from 'lodash';
import TagModel from 'shared/model/exercise/tag';

const BOOKS = {
  'stax-soc'     : 'Sociology',
  'stax-phys'    : 'College Physics',
  'stax-k12phys' : 'Physics',
  'stax-bio'     : 'Biology',
  'stax-apbio'   : 'Biology for AP® Courses',
  'stax-cbio'    : 'Concepts of Biology',
  'stax-econ'    : 'Economics',
  'stax-anp'     : 'Anatomy and Physiology',
  'stax-macro'   : 'Macro Economics',
  'stax-micro'   : 'Micro Economics'
};

function BookSelection(props) {
  const books = props.limit ? pick(BOOKS, props.limit) : BOOKS;

  return (
    <select
      className="form-control"
      onChange={props.onChange}
      value={get(props, 'selected.asString', '')}
    >
      {isEmpty(props.selected) && <option key="blank" value="" />}
      {map(books, (name, tag) => (
      <option key={tag} value={tag}>
        {name}
      </option>)
      )}
    </select>
  );
}

BookSelection.propTypes = {
  onChange: React.PropTypes.func,
  selected: React.PropTypes.instanceOf(TagModel),
  limit: React.PropTypes.array
};


export default BookSelection;
