import React from 'react';
import {
  ValueProp,
  ColumnContent,
  Column,
} from './common';
import CourseBranding from '../../branding/course';

export default function HowToUseQL() {

  return (
    <ValueProp className="question-library">
      <h1 className="heading">
        How to use the Question Library
      </h1>
      <h2 className="sub-heading">
        View all questions and exclude questions you never want students to see.
      </h2>
      <ColumnContent>
        <Column className="machine-learning">
          <p>
            <CourseBranding/> adds personalized and spaced practice questions to your assignments
          </p>
        </Column>
        <Column className="question-details">
          <p>
            You can view all questions <CourseBranding/> might use in the Question Library
          </p>
        </Column>
        <Column className="exclude-question">
          <p>
            If you see any questions you never want used, exclude them here before you publish your assignments
          </p>
        </Column>
      </ColumnContent>
    </ValueProp>
  );
}
