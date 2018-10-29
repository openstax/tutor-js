import React from 'react';
import { Card } from 'react-bootstrap';

export default function EmptyCourses() {
  return (
    <Card className="-course-list-empty">
      <p className="lead">
        We cannot find an OpenStax course associated with your account.
      </p>
      <p className="lead">
        <a target="_blank" href="https://openstax.secure.force.com/help">
          Get help >
        </a>
      </p>
    </Card>
  );
}
