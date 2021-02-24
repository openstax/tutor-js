import { React, styled, PropTypes, cn } from 'vendor';
import { Icon } from 'shared';
import { TextAction, Primary } from './buttons';

const Wrapper = styled.div`
  width: 350px;
  display: flex;
  padding: 2rem;
  min-height: 100px;
  flex-direction: column;
`;

const Header = styled.div.attrs({ className: 'header' })`
  color: #232E66;
  font-size: 18px;
  padding-bottom: 6px;
  padding-right: 18px;
  border-bottom: 1px solid #00c1de;
`;

const Body = styled.div.attrs({ className: 'body' })`
  flex: 1;
  color: #232E66;
  font-size: 16px;
  ${Header} + & {
    margin-top: 1.5rem;
  }
`;

const Footer = styled.div.attrs({ className: 'footer' })`
  display: flex;
  justify-content: ${props => props.manyButtons ? 'space-between' : 'flex-end'};
`;

const CancelIcon = styled(Icon)`
  position: absolute;
  top: 5px;
  right: 5px;
  color: darkGrey;
`;

const CancelButton = ({ ride }) => {
    return <CancelIcon type="close" onClick={ride.onCancel} />;
};
CancelButton.propTypes = {
    ride: PropTypes.object.isRequired,
};

export default
function StandardTourStep({ step, ride, buttons }) {

    if (step.displayWithButtons && !buttons) {
        buttons = [];
        if (ride.canGoBackward) {
            buttons.push(
                <TextAction key="l" onClick={ride.onPrevStep}>
                    <Icon type="chevron-left"/> Back
                </TextAction>
            );
        }
        buttons.push(
            <Primary key="p" data-test-id="primary-button" onClick={ride.onNextStep}>
                {ride.nextLabel}
            </Primary>
        );

    }

    return (
        <Wrapper
            data-test-id="tour-step"
            className={cn('tour-step', step.id)}
        >
            {step.isCancelable && <CancelButton ride={ride} />}
            {step.title && (
                <Header>
                    {step.title}
                </Header>
            )}
            <Body dangerouslySetInnerHTML={{ __html: step.HTML }} />
            {buttons && (
                <Footer manyButtons={buttons.length > 1}>
                    {buttons}
                </Footer>)}
        </Wrapper>
    );

}

StandardTourStep.propTypes = {
    step: PropTypes.object.isRequired,
    ride: PropTypes.object.isRequired,
    buttons: PropTypes.array,
};
