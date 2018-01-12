import { SnapShot, Wrapper } from '../components/helpers/component-testing';
import { bootstrapCoursesList } from '../courses-test-data';
import { StylesManager } from 'survey-react';

import Survey from '../../src/screens/surveys';
import SURVEY from '../../api/research_survey.json';
import EnzymeContext from '../components/helpers/enzyme-context';


describe('Surveys Screen', () => {

  let props, course, surveyRecord;

  beforeEach(() => {
    StylesManager.findSheet = jest.fn();
    props = {
      params: {
        courseId: '1',
        surveyId: '1',
      },
    };
    course = bootstrapCoursesList().get(1);
    course.studentTasks.fetch = jest.fn();

    course.studentTasks.onLoaded({
      data: { tasks: [],
        research_surveys: [SURVEY],
      },
    });
    surveyRecord = course.studentTasks.researchSurveys.get('1');
  });


  it('renders and matches snapshot', () => {
    const component = SnapShot.create(<Wrapper _wrapped_component={Survey} {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('submits survey when answered', () => {
    const survey = mount(<Survey {...props} />, EnzymeContext.build());
    survey.find('input[type="radio"]').first().simulate('change',
      { target: { value: 'bananas' } }
    );
    surveyRecord.save = jest.fn();
    survey.find('.sv_complete_btn').simulate('click', {});
    expect(surveyRecord.save).toHaveBeenCalled();
    expect(surveyRecord.response).toEqual({ favs: 'bananas' });
    survey.unmount();
  });

});
