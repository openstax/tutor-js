import React from 'react';
import { Panel } from 'react-bootstrap';

export default function NoHSTeachers() {
  return (
    <Panel className="no-hs-teachers">
      <p>
        Thanks for your interest in OpenStax Tutor Beta!  Unfortunately, we're not able to offer OpenStax Tutor to high school instructors and students at this time. We're working on this and we hope to make it available for you in the future.
      </p>
      <p>
        In the meantime, we have over 50 online homework and ancillary partners that have created low-cost tools that integrate with our books. You can find those resources at <a href="https://openstax.org/partners">openstax.org/partners</a>.
      </p>
    </Panel>
  );
}
