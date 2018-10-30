import React from 'react';
import { Container, Card } from 'react-bootstrap';

export default function EmptyCourses() {
  return (
    <Container>
      <Card className="-course-list-empty">
        <Card.Body>
          <p className="lead">
            We cannot find an OpenStax course associated with your account.
          </p>
          <Card.Text>
            <a target="_blank" href="https://openstax.secure.force.com/help">
              Get help >
            </a>
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}
