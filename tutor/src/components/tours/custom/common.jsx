import React        from 'react';

import classnames   from 'classnames';
import { forEach }  from 'lodash';

import CourseUX from '../../../models/course/ux';
import CourseBranding from '../../branding/course';

function ValueProp({ className, children }) {
  return <div className={classnames('value-prop', className)}>{children}</div>;
}

function ColumnContent({ children }) {
  return <div className="column-content">{children}</div>;
}

function Column({ className, children }) {
  return <div className={classnames('column', className)}>{children}</div>;
}

function getClickTarget(clickEvent) {
  return clickEvent.currentTarget.className.includes('joyride-') && [
    'A',
    'BUTTON',
  ].includes(clickEvent.currentTarget.tagName) ? clickEvent.currentTarget : clickEvent.target;
}

function bindClickHandler(handlers) {

  return ((clickEvent) => {
    const el = getClickTarget(clickEvent);
    const dataType = el.dataset.type;

    let handled = false;

    if (el.className.indexOf('joyride-') === 0) {
      forEach(handlers, (handler, name) => {
        if (dataType === name) {
          clickEvent.preventDefault();
          clickEvent.stopPropagation();

          handled = handler(clickEvent) || handled;
        }
      });
    }

    if (!handled) {
      this.props.step.joyrideRef.onClickTooltip(clickEvent);
    }

  });
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

function TutorCoachSunset(props) {
  return (
    <ValueProp className="cc-sunset">
      <h1 className="heading">Looking for your Concept Coach courses?</h1>
      <ColumnContent>
        <Column className="thanks">
          <p>Thanks for participating in the<br/>
            Concept Coach pilot! Read our<br/>
            <a
              target="_blank"
              href="https://openstax.org/blog/concept-coach-ending-greater-tools-are-coming"
            >blog post</a> to find out what we learned and how we’re moving forward.</p>
        </Column>
        <Column className="export-by">
          <p>The last day to export your<br/>
            Concept Coach scores reports is October 1.</p>
        </Column>
        {props.children}
      </ColumnContent>
    </ValueProp>
  );
}

function WelcomeToTutorMessage(props) {

  return (
    <ValueProp className="welcome-to-tutor">
      <h1 className="heading">Welcome to <CourseBranding />!</h1>
      {props.children}
      <TutorValueColumns {...props} />
    </ValueProp>
  );
}

export {
  ValueProp,
  ColumnContent,
  Column,
  TutorValueColumns,
  TutorCoachSunset,
  WelcomeToTutorMessage,
  bindClickHandler,
};
