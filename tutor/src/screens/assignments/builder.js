import { React, PropTypes, styled, observer } from 'vendor';
import { colors, fonts } from '../../theme';
import { Button } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import AssignmentUX from './ux';

const StyledWrapper = styled.div`
  max-width: 1200px;
  margin: 6rem auto;
`;

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
  text-transform: uppercase;
  margin-right: 2.4rem;
`;

const Body = styled.div`
  padding: 4rem 3rem 4rem 10rem;
  background: #fff;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  background: ${colors.neutral.bright};
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
`;

const StyledTextInput = styled(Field).attrs({
  type: 'text',
})`
  padding: 0.8rem 1rem;
  border-radius: 4px;
  border: 1px solid ${colors.forms.borders.light};
  font-size: 1.4rem;

  &:focus {
    border-color: ${colors.forms.borders.focus};
    box-shadow: 0 0 4px 0 ${colors.forms.borders.focusShadow};
  }

  &::placeholder {
    font-size: inherit;
  }
`;

const TextInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TextInputError = styled.div`
  color: red;
  margin: 1rem 0;
`;

const TextInput = (props) => (
  <TextInputWrapper>
    <StyledTextInput {...props} />
    <ErrorMessage name={props.name} render={msg => <TextInputError>{msg}</TextInputError>} />
  </TextInputWrapper>
);
TextInput.propTypes = {
  name: PropTypes.string.isRequired,
};

const AssignmentBuilder = observer(({ ux, children, title }) => {
  return (
    <StyledWrapper>
      <Header templateColors={colors.templates[ux.plan.type]}>
        <HeaderStep>
          Step {ux.stepNumber}
        </HeaderStep>
        {title}
      </Header>
      <Formik>
        <Body>
          {children}
        </Body>
      </Formik>
      <Footer>
        {!ux.canGoBackward && <Button variant="light">Cancel</Button>}
        {ux.canGoBackward && <Button variant="light" onClick={ux.goBackward}>Back</Button>}
        {ux.canGoForward && <Button variant="primary" onClick={ux.goForward}>Save & Continue</Button>}
      </Footer>
    </StyledWrapper>
  );
});

AssignmentBuilder.propTypes = {
  ux: PropTypes.instanceOf(AssignmentUX).isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

export { AssignmentBuilder, Row, SplitRow, HintText, Label, TextInput, Setting };
