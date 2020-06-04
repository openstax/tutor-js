import React from 'react';
import SupportLink from '../support-email-link';
import { Card } from 'react-bootstrap';
import styled from 'styled-components';

const ThanksButNo = styled(Card)`
padding: 2rem;
font-size: 2rem;
line-height: 2.5rem;
margin: 4rem auto;
max-width: 800px;
`;

export default function NonAllowedTeachers() {
  return (
    <ThanksButNo className="non-allowed-instructors">
      <p>
        Thanks for your interest in OpenStax Tutor Beta! At this time, OpenStax Tutor Beta is only available to instructors and students at 2- and 4-year institutions and high schools in the United States. Unfortunately, we're not able to offer OpenStax Tutor Beta to home school, corporate or international users at this time.
      </p>
      <p>
        In the meantime, we have over 50 online homework and ancillary partners that have created low-cost tools that integrate with our books. You can find those resources at <a href="https://openstax.org/partners">openstax.org/partners</a>.
      </p>
      <p>
        If you think you’ve reached this page in error, please contact <SupportLink displayEmail />.
      </p>
    </ThanksButNo>
  );
}
