import { Factory, R } from '../helpers';
import Survey from '../../src/screens/surveys';


describe('Surveys Screen', () => {

  let props, course, surveyRecord;

  beforeEach(() => {
    course = Factory.course();
    course.studentTaskPlans.fetch = jest.fn();
    course.studentTaskPlans.onLoaded({
      data: { tasks: [],
        research_surveys: [Factory.bot.create('ResearchSurvey')],
      },
    });
    surveyRecord = course.studentTaskPlans.researchSurveys.values()[0];
    props = {
      course,
      params: {
        courseId: course.id,
        surveyId: surveyRecord.id,
      },
    };
  });

  it('renders and matches snapshot', () => {
    expect.snapshot(<Survey {...props} />).toMatchSnapshot();
  });

  it('submits survey when answered', async () => {
    const survey = mount(<R><Survey {...props} /></R>);

    survey.find('input[placeholder="Jon Snow"]').first().simulate('blur',
      { target: { value: 'Bob' } }
    );

    survey.find('input[type="radio"]').first().simulate('change',
      { target: { value: 'yes' } }
    );
    surveyRecord.save = jest.fn();
    survey.find('.sv_complete_btn').simulate('click', {});
    expect(surveyRecord.save).toHaveBeenCalled();
    expect(surveyRecord.response).toMatchObject({ name: 'Bob' });
    survey.unmount();
  });

});
