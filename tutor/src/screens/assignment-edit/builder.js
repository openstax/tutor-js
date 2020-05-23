import { React, PropTypes, styled, observer } from 'vendor';
import { ScrollToTop } from 'shared';
import { colors, fonts } from 'theme';
import { ErrorMessage, Field } from 'formik';
import Controls from './controls';

const Header = styled.div`
  background: ${props => props.templateColors.background};
  border-left: 8px solid ${props => props.templateColors.border};
  background-color: ${props => props.templateColors.background};
  font-size: 1.8rem;
  font-weight: bold;
  padding: 1.5rem 3.2rem;
  display: flex;
`;

const HeaderStep = styled.div`
  font-size: 1.2rem;
  margin-right: 2.4rem;
  min-width: 4.1rem;
`;

const BodyWrapper = styled.div`
  border: 1px solid ${colors.neutral.pale};
  border-top-width: 0;
  border-radius: 0 0 2px 2px;
  background: #fff;
  padding-bottom: 6rem;
`;

const Body = styled.div`
  padding: 4rem;
`;

const Row = styled.div`
  margin: 2.4rem 0;
`;

const SplitRow = styled.div`
  display: flex;
  margin-bottom: 2.4rem;
  > * {
    flex-basis: 50%;
  }
`;

const Setting = styled.div`
  margin-bottom: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
`;

const HintText = styled.div`
  color: ${colors.neutral.dark};
  ${fonts.faces.light};
  margin-top: 0.5rem;
  line-height: 2rem;
`;

const TextInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TextInputError = styled.div.attrs({
  'aria-invalid': true,
})`
  color: red;
  margin: 1rem 0;
`;

// don't pass hasError onto Field, it'll set it on the DOM
// eslint-disable-next-line no-unused-vars
const StyledTextInput = styled(Field).withConfig({
  shouldForwardProp: (prop) => prop != 'hasError',
})`
  padding: 0.8rem 1rem;
  border-radius: 4px;
  border: 1px solid ${colors.forms.borders.light};
  font-size: 1.2rem;
  /** styling errors when template name is invalid */
  background: ${props => props.hasError ? colors.states.trouble : colors.white};
  color: ${props => props.hasError ? colors.red : colors.black};
  border-color: ${props => props.hasError ? colors.states.border_trouble : colors.neutral.pale};
  border-width: ${props => props.hasError ? '2px' : '1px'};

  &:focus {
    outline: 0;
    border-color: ${colors.forms.borders.focus};
    box-shadow: 0 0 4px 0 ${colors.forms.borders.focusShadow};
  }

  &::placeholder {
    font-size: inherit;
  }
`;

const TextInput = (props) => (
  <TextInputWrapper>
    <StyledTextInput {...props} />
    <ErrorMessage name={props.name} render={msg => <TextInputError data-target={props.name}>{msg}</TextInputError>} />
  </TextInputWrapper>
);
TextInput.propTypes = {
  name: PropTypes.string.isRequired,
};

const TextArea = (props) => (
  <TextInputWrapper>
    <StyledTextInput {...props}  component="textarea" rows="4" />
    <ErrorMessage name={props.name} render={msg => <TextInputError data-target={props.name}>{msg}</TextInputError>} />
  </TextInputWrapper>
);
TextArea.propTypes = {
  name: PropTypes.string.isRequired,
};

const AssignmentBuilder = observer(({ ux, children, title, middleControls }) => {
  return (
    <ScrollToTop>
      <Header className="heading" templateColors={colors.templates[ux.plan.type]}>
        <HeaderStep>
          {ux.steps.headerText}
        </HeaderStep>
        {title}
      </Header>
      <BodyWrapper>
        {children}
      </BodyWrapper>
      <Controls ux={ux} middleControls={middleControls} />
    </ScrollToTop>
  );
});

AssignmentBuilder.propTypes = {
  ux: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  middleControls: PropTypes.node,
};

export { AssignmentBuilder, Row, SplitRow, HintText, Label, TextInput, TextArea, Setting, Body };
