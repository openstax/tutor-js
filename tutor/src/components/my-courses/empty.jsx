import React from 'react';
import { Container, Card } from 'react-bootstrap';
import styled from 'styled-components';

const Wrapper = styled(Card)`
margin-top: 40px;
font-size: 2rem;
`;

export default function EmptyCourses() {
    return (
        <Container>
            <Wrapper className="-course-list-empty">
                <Card.Body>
                    <p className="lead">
            We cannot find an OpenStax course associated with your account.
                    </p>
                    <Card.Text>
                        <a target="_blank" href="https://openstax.secure.force.com/help">
              Get help &gt;
                        </a>
                    </Card.Text>
                </Card.Body>
            </Wrapper>
        </Container>
    );
}
