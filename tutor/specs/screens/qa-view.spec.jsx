import { React, SnapShot, Wrapper } from '../components/helpers/component-testing';
import { times } from 'lodash';
import Factory, { FactoryBot } from '../factories';
import QA from '../../src/screens/qa-view/view';
import QaUX from '../../src/screens/qa-view/ux';
import EnzymeContext from '../components/helpers/enzyme-context';

jest.mock('../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('QA Screen', function() {
  let props, ux, currentSection, book;

  beforeEach(function() {
    const exercises = Factory.exercisesMap();
    const ecosystems = Factory.ecosystemsMap();
    ux = new QaUX({ router, exercises, ecosystems });
    const ecosystem = ux.ecosystemsMap.array[0];
    book = ecosystem.referenceBook;
    book.onApiRequestComplete({ data: [FactoryBot.create('Book')] });
    book.fetch = jest.fn(() => Promise.resolve());
    currentSection = book.pages.byChapterSection.keys()[2];
    ux.update({
      ecosystemId: ecosystem.id,
      section: currentSection,
    });

    const router = {
      history: {
        push: jest.fn(),
      },
    };
    props = {
      ux,
    };
  });

  it('renders as loading then matches snapshot', () => {
    const qa = mount(<QA {...props} />, EnzymeContext.build());
    const page = book.pages.byChapterSection.get(currentSection);
    ux.exercisesMap.onLoaded({ data: { items: times(8, () => FactoryBot.create('TutorExercise', {
      page_uuid: page.uuid,
    })) } }, [{ book, page_ids: [ page.id ]  }]);
    expect(ux.isFetchingExercises).toBe(false);
    expect(qa.debug()).toMatchSnapshot();
    ux.setDisplayingPanel({}, false);
    expect(qa.debug()).toMatchSnapshot();
    expect(ux.activePage).not.toBeNull();
    qa.unmount();
  });

});
