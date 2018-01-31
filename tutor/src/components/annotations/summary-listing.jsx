import React from 'react';
import { map } from 'lodash';

const SummaryListing = ({ annotations }) => (
  <div className="annotations">
    {map(annotations, (notes, ch) =>
      <div key={ch}>
        <h2>{notes[0].formattedChapterSection} {notes[0].title}</h2>
        {map(notes, (annotation) => (
          <div key={annotation.id}>
            <p style={{fontStyle: 'italic'}}>
              {annotation.selection.content}
            </p>
            <p>
              {annotation.text}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
);

SummaryListing.propTypes = {
  annotations: React.PropTypes.object.isRequired
}
export default SummaryListing;
