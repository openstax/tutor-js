import { React, PropTypes, styled, css, cn } from 'vendor';
import { forwardRef } from 'react';
import { Dropdown } from 'react-bootstrap';
import CheckboxInput from '../checkbox-input';
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
const CustomToggle = forwardRef((props, ref) => {
  return (
    <span
      aria-label={props.text}
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        props.onClick(e);
      }}
    >
      {props.text}
      <Icon
        size="lg"
        type={props['aria-expanded'] ? 'angle-up' : 'angle-down'}
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

const QuestionFilters = (props) => {
  if(props.exerciseType !== 'homework') return null;

  return (
    <StyledQuestionFilter className={cn(props.className)}>
      <StyledDropdown blankwidth='13.8rem'>
        <Dropdown.Toggle
          as={CustomToggle}
          text="Question Type"
          id="dropdown-custom-components"/>
        <Dropdown.Menu as={CustomMenu}>
          <CheckboxInput
            onChange={({ target: { checked } }) => {
              props.onQuestionTypeFilterChange('showMPQ', checked);
            }}
            checked={props.showMPQ}
            label="Multiple-choice questions"
            labelSize="lg"
            standalone
          />
          <CheckboxInput
            onChange={({ target: { checked } }) => {
              props.onQuestionTypeFilterChange('showWRQ', checked);
            }}
            checked={props.showWRQ}
            label="Written-response questions"
            labelSize="lg"
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
              props.onQuestionTypeFilterChange('showTutor', checked);
            }}
            checked={props.showTutor}
            label="Openstax Tutor"
            labelSize="lg"
            standalone
          />
          <CheckboxInput
            onChange={({ target: { checked } }) => {
              props.onQuestionTypeFilterChange('showOwned', checked);
            }}
            checked={props.showOwned}
            label="My questions"
            labelSize="lg"
            standalone
          />
          <CheckboxInput
            onChange={({ target: { checked } }) => {
              props.onQuestionTypeFilterChange('showOthers', checked);
            }}
            checked={props.showOthers}
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
  exerciseType: PropTypes.string.isRequired,
  showMPQ: PropTypes.bool.isRequired,
  showWRQ: PropTypes.bool.isRequired,
  showTutor: PropTypes.bool.isRequired,
  showOwned: PropTypes.bool.isRequired,
  showOthers: PropTypes.bool.isRequired,
  onQuestionTypeFilterChange: PropTypes.func.isRequired,
};

export default QuestionFilters;
