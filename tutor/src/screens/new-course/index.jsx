import { React } from '../../helpers/react';
import { ScrollToTop } from 'shared';
import Wizard from './wizard';
import './styles.scss';

const NewCourse = () => (
  <ScrollToTop>
    <div className="new-course-wizard">
      <Wizard />
    </div>
  </ScrollToTop>
);

export default NewCourse;
