import React from 'react'
import { connect } from 'react-redux'
import { isEmpty, reduce, find, map } from 'lodash'
import styled from 'styled-components'
import { colors } from 'theme'

const StyledMyCoursesDashboard = styled.div`
    .offering-container {
        margin: 1.6rem;
        background-color: ${colors.neutral.bright};
        padding-top: 2.4rem;
        padding-left: 3.2rem;
        h2 {
            font-weight: 700;
            font-size: 2.4rem;
            line-height: 3rem;
            color: ${colors.neutral.std};
        }
    }
`

export const MyCoursesDashboard = ({ coursesByOffering }) => {
    return (
        <StyledMyCoursesDashboard>
            {
                map(coursesByOffering, (value, key) => 
                    <div className="offering-container">
                        <h2>{key}</h2>
                    </div>    
                )
            }
        </StyledMyCoursesDashboard>
    )
}

const mapStateToProps = (state) => {
    let coursesByOffering = {}
    if(!isEmpty(state.courses.entities) && !isEmpty(state.offerings.entities)) {
        coursesByOffering = reduce(state.courses.entities, (result, value) => {
            const offering = find(state.offerings.entities, o => o.id === value.offering_id);
            (result[offering.title] || (result[offering.title] = [])).push(value);
            return result;
        }, {})
    }
    return {
        coursesByOffering,
    }
}

export default connect(mapStateToProps)(MyCoursesDashboard)
