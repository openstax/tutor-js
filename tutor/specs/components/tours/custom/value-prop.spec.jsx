import {SnapShot} from '../../helpers/component-testing'
import ValueProp from '../../../../src/components/tours/custom/value-prop';
import { bootstrapCoursesList } from '../../../courses-test-data';


describe('Tour Value Prop Component', () => {
  it('matches snapshot for tutor', () => {
    expect(SnapShot.create(<ValueProp />).toJSON()).toMatchSnapshot();
  });

  it('matches snapshot for cc', () => {
    const courses = bootstrapCoursesList();
    const course = courses.get(2);
    course.is_concept_coach = true;
    expect(SnapShot.create(<ValueProp />).toJSON()).toMatchSnapshot();
  });

  it('matches snapshot for sunset cc', () => {
    const courses = bootstrapCoursesList();
    courses.delete('3');
    courses.delete('1');
    const course = courses.get(2);
    course.is_concept_coach = true;
    course.appearance_code = 'micro_econ';
    expect(SnapShot.create(<ValueProp />).toJSON()).toMatchSnapshot();
  });

});
