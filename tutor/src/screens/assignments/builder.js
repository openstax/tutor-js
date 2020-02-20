import { React, PropTypes, styled, observer } from 'vendor';
import { ScrollToTop } from 'shared';
import { colors, fonts } from 'theme';
import { Field, ErrorMessage } from 'formik';
import Controls from './controls';

const FormWrapper = styled.div`
  max-width: 1200px;
  min-width: 1100px;
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
  margin-right: 2.4rem;
  min-width: 4.1rem;
`;

const BodyWrapper = styled.div`
  border: 1px solid ${colors.neutral.pale};
  border-top-width: 0;
  border-radius: 0 0 2px 2px;
  background: #fff;
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

const TextArea = (props) => (
  <TextInputWrapper>
    <StyledTextInput as="textarea" rows="4" {...props} />
  </TextInputWrapper>
);
TextArea.propTypes = {
  name: PropTypes.string.isRequired,
};

const AssignmentBuilder = observer(({ ux, children, title, middleControls }) => {
  return (
    <ScrollToTop>
      <FormWrapper>
        <Header className="heading" templateColors={colors.templates[ux.plan.type]}>
          <HeaderStep>
            {ux.steps.text}
          </HeaderStep>
          {title}
        </Header>
        <BodyWrapper>
          {children}
        </BodyWrapper>
      </FormWrapper>
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
