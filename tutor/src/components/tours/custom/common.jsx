/* eslint-disable react/prop-types */
import { React, styled, cn } from '../../../helpers/react';
import { Primary }  from './buttons';
import CourseUX from '../../../models/course/ux';
import CourseBranding from '../../branding/course';

const Footer = styled.div`
  display: flex;
  justify-content: center;
`;

function ValueProp({ className, children, ride }) {
  return (
    <div className={cn('value-prop', className)}>
      {children}
      <Footer>
        <Primary onClick={ride.onNextStep}>Continue</Primary>
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
  if (!withoutCost) {
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
      <h1 className="heading">Welcome to <CourseBranding />!</h1>
      {children}
      <TutorValueColumns {...props} />
    </ValueProp>
  );
}

export {
  Column,
  ValueProp,
  ColumnContent,
  TutorValueColumns,
  WelcomeToTutorMessage,
};
