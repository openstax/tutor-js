import React from 'react';
import { observer } from 'mobx-react';
import { Icon } from 'shared';

const BookTitle = observer(({ ux: { book } }) => {
  if (!book) { return null; }

  return (
    <div className="book-title">
      {book.title}
      <Icon type="angle-right" />
    </div>
  );
});

export default BookTitle;
