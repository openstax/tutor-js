/* eslint-disable react/prop-types */
import { React, styled, cn } from 'vendor';
import { Primary } from './buttons';
import { CourseUX } from '../../../models';
import CourseBranding from '../../branding/course';
import { colors } from 'Theme';

const Footer = styled.div`
    display: flex;
    justify-content: center;
`;

const StyledPrimary = styled(Primary)`
    background: #007297;
    font-weight: bold;
    border: none;
    border-radius: 2px;
    width: 256px;
    height: 48px;

    &:hover {
        background: #2092b7;
    }
`;

const GreenTooltip = styled.div`
    background: ${colors.secondary};

    .header {
        color: #fff;
        padding: 9px 10px;
        font-size: 1.6rem;
        line-height: 2rem;
        letter-spacing: -0.64px;
    }
`;

function ValueProp({ className, children, ride }) {
    return (
        <div data-test-id="value-prop" className={cn('value-prop', className)}>
            {children}
            <Footer>
                <StyledPrimary onClick={ride.onNextStep}>Continue</StyledPrimary>
            </Footer>
        </div>
    );
}

function ColumnContent({ children }) {
    return <div className="column-content">{children}</div>;
}

function Column({ className, children }) {
    return <div className={cn('column', className)}>{children}</div>;
}

function TutorValueColumns({ withoutCost }) {
    let cost = null;
    if (CourseUX.displayCosts && !withoutCost) {
        cost = (
            <Column className="low-cost">
                <h3>Low cost</h3>
                <p>{CourseUX.formattedStudentCost} per course saves students money</p>
            </Column>
        );
    }
    return (
        <ColumnContent>
            <Column className="spaced">
                <h3>Spaced practice</h3>
                <p>Help students remember what they previously learned</p>
            </Column>
            <Column className="personalized">
                <h3>Personalized questions</h3>
                <p>Help students improve where they need it most</p>
            </Column>
            <Column className="two-step">
                <h3>Two-step questions</h3>
                <p>Help students study more effectively</p>
            </Column>
            {cost}
        </ColumnContent>
    );
}


function WelcomeToTutorMessage(props) {
    const { className, children } = props;
    return (
        <ValueProp {...props} className={cn('welcome-to-tutor', className)}>
            <h1 className="heading"><span className="welcome-to">Welcome to</span> <CourseBranding />!</h1>
            {children}
            <TutorValueColumns {...props} />
        </ValueProp>
    );
}

export {
    Column,
    ValueProp,
    GreenTooltip,
    ColumnContent,
    TutorValueColumns,
    WelcomeToTutorMessage,
};
