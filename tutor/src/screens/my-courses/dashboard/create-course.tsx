import React from 'react'
import styled from 'styled-components'
import TutorLink from '../../../components/link'
import IconAdd from '../../../components/icons/add'
import TourAnchor from '../../../components/tours/anchor'
import { colors } from 'theme'

const StyledCreateCourse = styled.div`
  &&& {
    .my-courses-add-zone {
      border: 1px solid ${colors.neutral.pale};
      background-color: white;
      box-shadow: 0 5px 5px ${colors.neutral.pale};
      svg {
        margin-bottom: 1.8rem;
      }
      .create-label {
        font-weight: bold;
        color: ${colors.neutral.thin};
      }
    }
  }
`

interface CreateCourseProps {
  appearanceCode: string
}

const CreateCourse: React.FC<CreateCourseProps> = ({ appearanceCode }) => {
    return (
      <StyledCreateCourse>
        <TourAnchor id="create-course-zone">
          <div className="my-courses-add-zone">
          <TutorLink to="createNewCourseFromOffering" params={{ appearanceCode }}>
            <div>
              <IconAdd />
              <span className="create-label">
                CREATE A COURSE
              </span>
            </div>
          </TutorLink>
        </div>
        </TourAnchor>
      </StyledCreateCourse>)
}

export default CreateCourse
