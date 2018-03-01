import { React, SnapShot } from '../components/helpers/component-testing';
import Router from '../../src/helpers/router';
import Ecosystems from '../../src/models/ecosystems';
import { action } from 'mobx';
import { bootstrapCoursesList } from '../courses-test-data';
import QA from '../../src/screens/qa-view/view';
import QaUX from '../../src/screens/qa-view/ux';
import EnzymeContext from '../components/helpers/enzyme-context';
import Exercises from '../../src/models/exercises';
import ECOSYSTEMS from '../../api/ecosystems.json';
import REFERENCE_BOOK from '../../api/ecosystems/1/readings.json';
import EXERCISES from '../../api/ecosystems/1/exercises.json';
import REFERENCE_BOOK_PAGE_DATA from '../../api/pages/17f6ff53-2d92-4669-acdd-9a958ea7fd0a@12.json';
const ECOSYSTEM_ID = '1';
const SECTION = '2.1';
const ECO_SECTION = { ecosystemId: ECOSYSTEM_ID, section: SECTION };
jest.mock('../../src/helpers/router');

describe('QA Screen', function() {
  let props, ux, course, router;

  beforeEach(function() {
    Ecosystems.onLoaded({ data: ECOSYSTEMS });

    Ecosystems.get(ECOSYSTEM_ID).referenceBook.fetch=jest.fn(action(function() {
      this.onApiRequestComplete({ data: REFERENCE_BOOK });
      //this.pages.values().forEach((pg) => pg.fetch = jest.fn());
      this.pages.get(SECTION)
        .onContentFetchComplete({ data: REFERENCE_BOOK_PAGE_DATA });
      return Promise.resolve(this);
    }));

    router = {
      history: {
        push: jest.fn(),
      },
    };
    router = {};
    ux = new QaUX(router);
    props = {
      ux,
    };
  });

  it('renders as loading then matches snapshot', () => {
    const qa = mount(<QA {...props} />, EnzymeContext.build());
    expect(qa.html()).toMatchSnapshot();

    ux.update(ECO_SECTION);
    expect(ux.ecosystem).not.toBeNull();
    expect(ux.activePage).not.toBeNull();
    expect(qa.html()).toMatchSnapshot();

    Exercises.onLoaded({ data: EXERCISES }, [{ ecosystem_id: ECOSYSTEM_ID, page_id: ux.activePage.id }]);
    expect(ux.isFetchingExercises).toEqual(false);
    expect(qa.html()).toMatchSnapshot();
  });

});
