import { React, styled, PropTypes, observer } from 'vendor';
import { GradingTemplate } from '../../models/grading/templates';
import { Card, Button } from 'react-bootstrap';
import Theme from '../../theme';
import { Icon } from 'shared';

const CardWrapper = styled.div`
  flex: 1;
  margin-top: 2.4rem;
  color: ${Theme.colors.neutral.darker};
  line-height: 2rem;

  .card {
    border: 1px solid #d5d5d5;
  }
  .card-header {
    border: 0;
    border-left: 8px solid ${props => props.theme.border};
    background: ${props => props.theme.background};
    font-size: 1.6rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .btn-link {
      color: ${Theme.colors.neutral.darker};
      padding: 0;
    }
  }
`;

const SectionTitle = styled.h4`
  font-size: 1rem;
  text-transform: uppercase;
  padding-top: 0.8rem;

  &:not(:first-child) {
    border-top: 1px solid #d5d5d5;
    margin-top: 0.8rem;
  }
`;

const SettingTitle = styled.div`
  color: #6f6f6f;
`;

const SettingText = styled.div`
  font-weight: bold;
`;

const TemplateCard = observer(({ template, onEdit }) => {
  return (
    <CardWrapper theme={Theme.colors.templates[template.type]}>
      <Card>
        <Card.Header>
          {template.name}
          <div>
            <Button onClick={() => onEdit(template)} variant="link">
              <Icon type="edit" />
            </Button>
            <Button variant="link">
              <Icon type="trash" />
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <SectionTitle>Uppercase Section title</SectionTitle>
          <SettingTitle>Setting title:</SettingTitle>
          <SettingText>Setting text</SettingText>
          <SettingTitle>Setting title:</SettingTitle>
          <SettingText>Setting text</SettingText>

          <SectionTitle>Uppercase Section title</SectionTitle>
          <SettingTitle>Setting title:</SettingTitle>
          <SettingText>Setting text</SettingText>
          <SettingTitle>Setting title:</SettingTitle>
          <SettingText>Setting text</SettingText>

          <SectionTitle>Uppercase Section title</SectionTitle>
          <SettingTitle>Setting title:</SettingTitle>
          <SettingText>Setting text</SettingText>
          <SettingTitle>Setting title:</SettingTitle>
          <SettingText>Setting text</SettingText>
        </Card.Body>
      </Card>
    </CardWrapper>
  );
});
TemplateCard.displayName = 'TemplateCard';
TemplateCard.propTypes = {
  onEdit: PropTypes.func.isRequired,
  template: PropTypes.instanceOf(GradingTemplate).isRequired,
};

export default TemplateCard;
