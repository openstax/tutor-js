import { EnzymeContext, C  } from '../helpers';
import { times } from 'lodash';
import Factory, { FactoryBot } from '../factories';
import QA from '../../src/screens/qa-view/view';
import Book from '../../src/models/reference-book';
import QaUX from '../../src/screens/qa-view/ux';

jest.mock('../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('QA Screen', function() {
  let props, ux, currentSection, book;


  beforeEach(function() {
    const router = {
      history: {
        push: jest.fn(),
      },
    };
    const exercises = Factory.exercisesMap();
    const ecosystems = Factory.ecosystemsMap();
    exercises.fetch = jest.fn();
    jest.spyOn(Book.prototype, 'fetch').mockImplementation(function() {
      this.onApiRequestComplete({
        data: [FactoryBot.create('Book', { id: this.id, type: 'biology' })],
      });
      return Promise.resolve();
    });
    ux = new QaUX({ router, exercises, ecosystems });
    const ecosystem = ux.ecosystemsMap.array[0];
    ux.update({
      ecosystemId: ecosystem.id,
      chapterSection: '1.1',
    });

    const page = ux.page;
    ux.exercisesMap.onLoaded({
      data: {
        items: times(8, () => FactoryBot.create('TutorExercise', {
          page_uuid: page.uuid,
        })),
      },
    }, [{ book, page_ids: [ page.id ]  }]);

    props = {
      ux,
    };
  });

  it('matches snapshot', () => {
    expect.snapshot(<C><QA {...props} /></C>).toMatchSnapshot();
  });

  it('loads exercises', () => {
    const qa = mount(<C><QA {...props} /></C>);
    expect(ux.exercisesMap.fetch).toHaveBeenCalledWith({
      book: ux.book,
      course: undefined,
      limit: false,
      page_ids: [ux.page.id],
    });
    qa.unmount();
  });
});
