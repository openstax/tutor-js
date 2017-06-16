import React from 'react';
import Router from '../../helpers/router';

import { Grid, Row, Col } from 'react-bootstrap';
import YouTube from 'react-youtube';
import BackButton from '../buttons/back-button';

export default function StudentPreview() {
  const params = Router.currentParams();
  const { courseId } = params;
  const backLink = courseId ? { to: 'dashboard', text: 'Back to Dashboard', params: { courseId } } :
                   { to: 'myCourses', text: 'Back to My Courses' };

  return (
    <Grid className="student-preview">
      <header>
        <h1>Preview the Student Experience</h1>
        <BackButton fallbackLink={backLink} />
      </header>

      <Row className="section">
        <Col sm={6} className="txt">
          <h3>Student dashboard</h3>
          <p>
            The dashboard gives students an overview of the course, assignments, progress, and performance. Students can see when assignments are due, start current assignments, review past work, and access their textbook. The student Performance Forecast shows students their performance within each section of the textbook, highlights their weaker areas, and lets them practice on their own.
          </p>
        </Col>
        <Col sm={6} className="vid">
          <YouTube
            videoId="AEUgriQUjPc"
            opts={{
              width: '100%',
            }}
          />
        </Col>
      </Row>

      <Row className="section">
        <Col sm={6} className="txt">
          <h3>Reading assignment</h3>
          <p>
            OpenStax Tutor Beta reading assignments present the textbook to students in manageable chunks and engage students with videos, case studies, and interactive elements. As students read, each section is followed by personalized, two-step questions that give immediate feedback.
          </p>
        </Col>
        <Col sm={6} className="vid">
          <YouTube
            videoId="emjbBoV0Ixs"
            opts={{
              width: '100%',
            }}
          />
        </Col>
      </Row>

      <Row className="section">
        <Col sm={6} className="txt">
          <h3>Homework assignment</h3>
          <p>
            After students work instructor-assigned questions, OpenStax Tutor Beta will unlock personalized and spaced practice questions chosen specifically for each student. These two-step questions prompt students to recall the answer from memory before selecting a multiple choice option.
          </p>
        </Col>
        <Col sm={6} className="vid">
          <YouTube
            videoId="Aoco1IRixZA"
            opts={{
              width: '100%',
            }}
          />
        </Col>
      </Row>

    </Grid>
  );
}
