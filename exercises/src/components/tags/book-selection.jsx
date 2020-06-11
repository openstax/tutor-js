import PropTypes from 'prop-types';
import React from 'react';
import { map, isEmpty, pick } from 'lodash';

const BOOKS = {
  'stax-anp':     'Anatomy and Physiology',
  'stax-apbio':   'Biology for AP® Courses',
  'stax-bio':     'Biology',
  'stax-apphys':  'College Physics for AP® Courses',
  'stax-phys':    'College Physics',
  'stax-cbio':    'Concepts of Biology',
  'stax-econ':    'Economics',
  'stax-eship':   'Entrepreneurship',
  'stax-macro':   'Macro Economics',
  'stax-micro':   'Micro Economics',
  'stax-k12phys': 'HS Physics',
  'stax-soc':     'Sociology',
  'stax-apush':   'U.S. History for AP® Courses',
};

function BookSelection(props) {
  const books = props.limit.length ? pick(BOOKS, props.limit) : BOOKS;

  return (
    <select
      className="form-control"
      onChange={props.onChange}
      value={props.selected || ''}
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
  onChange: PropTypes.func,
  selected: PropTypes.string,
  limit: PropTypes.array,
};

BookSelection.defaultProps = {
  limit: [],
};


export default BookSelection;
