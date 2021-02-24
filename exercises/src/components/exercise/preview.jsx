import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { ExercisePreview } from 'shared';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { CornerRibbon } from 'shared';

const Preview = styled.div`
  margin-top: 1.5rem;
`;

@observer
export default
class ExerciseEditingPreview extends React.Component {

  static propTypes = {
      exercise: PropTypes.object.isRequired,
      displayEditLink: PropTypes.bool,
      showEdit: PropTypes.bool,
  }

  render() {
      const { showEdit, exercise, ...previewProps } = this.props;

      return (
          <Preview>
              <CornerRibbon
                  shadow
                  color={exercise.canEdit ? 'green' : 'navy'}
                  position="topRight"
                  hidden={exercise.canEdit && !exercise.is_vocab}
                  label={[
                      <div key="ro">{ exercise.canEdit ? 'VOCABULARY' : 'READ ONLY' }</div>,
                      <div key="n">{exercise.readOnlyReason}</div>,
                  ]}
              >
                  <ExercisePreview
                      className='exercise-editing-preview'
                      isInteractive
                      displayAllTags
                      displayFeedback
                      displayFormats
                      displayNickname
                      exercise={exercise}
                      {...previewProps}
                  >
                      {showEdit && exercise.canEdit && <Link className="btn" to={`/exercise/${exercise.uid}`}>EDIT</Link>}
                  </ExercisePreview>
              </CornerRibbon>
          </Preview>
      );
  }

}
