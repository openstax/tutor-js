import { React, PropTypes, styled, css, cn } from 'vendor';
import { forwardRef, useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import CheckboxInput from '../checkbox-input';
import { ExercisesMap, currentUser } from '../../models';
import { Icon } from 'shared';
import { colors } from 'theme';

const border = css`
    border: 1px solid ${colors.neutral.pale};
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
`;

const StyledQuestionFilter = styled.div`
    display: flex;
`;

const StyledDropdown = styled(Dropdown)` 
    > span {
        cursor: pointer;
        padding: 1.8rem 1rem;
        color: ${colors.neutral.grayblue};
        font-weight: 700;
        border: 1px solid transparent;
        flex: 1;
        svg {
            margin-left: 0.7rem;
        }
    }
    &.show > span {
        ${border}
    }
    & + & {
        margin-left: 3rem;
    }
    .dropdown-menu.show {
      ${border}
      display: flex;
      flex-flow: column wrap;
      padding: 2.9rem 1.6rem;
      color: ${colors.neutral.darker};
      width: 25rem;
      span:not(:first-child) {
          margin-top: 1rem;
      }
      &:after {    
        content: '';
        display: block;
        position: absolute;
        width: ${props => props.blankwidth || '100px'};
        top: -6px;
        left: 0px;
        border: 3px solid white;
      }
    }
`;

//needs ref to get into the DOM
const CustomToggle = forwardRef(({ text, onClick, 'aria-expanded': ariaExpanded }, ref) => {
    return (
        <span
            aria-label={text}
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {text}
            <Icon
                size="lg"
                type={ariaExpanded ? 'angle-up' : 'angle-down'}
            />
        </span>
    );
});
CustomToggle.propTypes = {
    text: PropTypes.string.isRequired,
    // Inherited from Dropdown.Toggle
    'aria-expanded': PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};
  
// ref needed here also for dropdown to access the menu DOM
const CustomMenu = forwardRef(
    ({ children, className, style,'aria-labelledby': labeledBy, inlineStyle = {} }, ref) => {
        return (
            <div
                ref={ref}
                style={{ ...style, ...inlineStyle, top: '-2px' }}
                className={className}
                aria-labelledby={labeledBy}
            >
                {children}
            </div>
        );
    },
);
CustomMenu.propTypes = {
    inlineStyle: PropTypes.object,
    // Inherited from Dropdown.Menu
    children: PropTypes.node.isRequired,
    className: PropTypes.string.isRequired,
    style: PropTypes.object.isRequired,
    'aria-labelledby': PropTypes.string.isRequired,
};

const QuestionFilters = ({ exercises, returnFilteredExercises, className='' }) => {
    if(!exercises) {
        return null;
    }

    const [filters, setFilters] = useState({
        showMPQ: true,
        showWRQ: true,
        showTutor: true,
        showOwned: true,
        showOthers: true,
    });

    const onFiltersChanged = (filter, checked) => {
        setFilters(prevFilters => ({ ...prevFilters, [filter]: checked }));
    };

    // updates the props.exercises when a filter has changed
    // send the filtered props.exercises back through props.returnFilteredExercises
    useEffect(() => {
        let ex = exercises;
        if(!ex) return [];
        ex = ex.where(e => {
            const filterByQuestionSource =
      (filters.showTutor && e.belongsToOpenStax) ||
      (filters.showOwned && e.belongsToUser(currentUser)) ||
      (filters.showOthers && e.belongsToOtherUser(currentUser));
            const filterByQuestionType =
       (filters.showMPQ && e.isMultiChoice) ||
       (filters.showWRQ && e.isWrittenResponse);
      
            return filterByQuestionSource && filterByQuestionType;
        });
        returnFilteredExercises(ex);
        return () => {};
    }, [filters, exercises]);

    return (
        <StyledQuestionFilter className={cn(className)}>
            <StyledDropdown blankwidth='13.9rem' data-test-id="question-type-menu">
                <Dropdown.Toggle
                    as={CustomToggle}
                    text="Question Type"
                    id="dropdown-custom-components"/>
                <Dropdown.Menu as={CustomMenu}>
                    <CheckboxInput
                        onChange={({ target: { checked } }) => {
                            onFiltersChanged('showMPQ', checked);
                        }}
                        checked={filters.showMPQ}
                        label="Multiple-choice questions"
                        labelSize="lg"
                        data-test-id='mcq-filter'
                        standalone
                    />
                    <CheckboxInput
                        onChange={({ target: { checked } }) => {
                            onFiltersChanged('showWRQ', checked);
                        }}
                        checked={filters.showWRQ}
                        label="Written-response questions"
                        labelSize="lg"
                        data-test-id='wrq-filter'
                        standalone
                    />
                </Dropdown.Menu>
            </StyledDropdown>
            <StyledDropdown blankwidth='15.5rem'>
                <Dropdown.Toggle
                    as={CustomToggle}
                    text="Question Source"
                    id="dropdown-custom-components"/>
                <Dropdown.Menu as={CustomMenu}>
                    <CheckboxInput
                        onChange={({ target: { checked } }) => {
                            onFiltersChanged('showTutor', checked);
                        }}
                        checked={filters.showTutor}
                        label="Openstax Tutor"
                        labelSize="lg"
                        standalone
                    />
                    <CheckboxInput
                        onChange={({ target: { checked } }) => {
                            onFiltersChanged('showOwned', checked);
                        }}
                        checked={filters.showOwned}
                        label="My questions"
                        labelSize="lg"
                        standalone
                    />
                    <CheckboxInput
                        onChange={({ target: { checked } }) => {
                            onFiltersChanged('showOthers', checked);
                        }}
                        checked={filters.showOthers}
                        label="My co-teachers"
                        labelSize="lg"
                        standalone
                    />
                </Dropdown.Menu>
            </StyledDropdown>
        </StyledQuestionFilter>
    );
};

QuestionFilters.propTypes = {
    className: PropTypes.string,
    exercises: PropTypes.instanceOf(ExercisesMap).isRequired,
    returnFilteredExercises: PropTypes.func.isRequired,
};

export default QuestionFilters;
