import { React, PropTypes, idType, styled } from '../../helpers/react';
import BackButton from '../buttons/back-button';

const Card = styled.div`
  max-width: 1000px;
  margin: 100px auto;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
  padding: 1rem 2rem;
  .btn {
    margin-top: 40px;
  }
`;

export
function EventTask({ courseId, task }) {

  return (
    <Card>
      <h2>{task.title}</h2>
      <h3 className="lead">{task.description}</h3>
      <BackButton
        fallbackLink={{
          text: 'Back to dashboard', to: 'dashboard', params: { courseId },
        }} />
    </Card>
  );

}

EventTask.propTypes = {
  courseId: idType.isRequired,
  task: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};
