import { SnapShot, Wrapper } from '../helpers';
import Factory, { faker } from '../../specs/factories';
import Survey from '../../src/screens/surveys';
import EnzymeContext from '../helpers/enzyme-context';


describe('Surveys Screen', () => {

  let props, course, surveyRecord;

  beforeEach(() => {
    faker.seed(12345);
    course = Factory.course();
    course.studentTasks.fetch = jest.fn();
    course.studentTasks.onLoaded({
      data: { tasks: [],
        research_surveys: [Factory.data('ResearchSurvey')],
      },
    });
    surveyRecord = course.studentTasks.researchSurveys.values()[0];
    props = {
      course,
      params: {
        courseId: course.id,
        surveyId: surveyRecord.id,
      },
    };
  });

  it('renders and matches snapshot', () => {
    const component = SnapShot.create(<Wrapper _wrapped_component={Survey} {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('submits survey when answered', async () => {
    const survey = mount(<Survey {...props} />, EnzymeContext.build());

    survey.find('input[placeholder="Jon Snow"]').first().simulate('blur',
      { target: { value: 'Bob' } }
    );

    survey.find('input[type="radio"]').first().simulate('change',
      { target: { value: 'yes' } }
    );
    surveyRecord.save = jest.fn();
    survey.find('.sv_complete_btn').simulate('click', {});
    expect(surveyRecord.save).toHaveBeenCalled();
    expect(surveyRecord.response).toEqual({ name: 'Bob', bananas: 'yes' });
    survey.unmount();
  });

});
