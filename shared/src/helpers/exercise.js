import qs from 'qs';
import { omitBy, isUndefined } from 'lodash';

// This list maps Tutor book UUID's to the their official OpenStax title.
// It's used to pre-fill the errata submission form on webview with
// the correct book title, which requires an exact title match
const BOOK_UID_XREF = {
  '27275f49-f212-4506-b3b1-a4d5e3598b99': 'College Physics', // CC Version
  'd52e93f4-8653-4273-86da-3850001c0786': 'Concepts of Biology',
  '947a1417-5fd5-4b3c-ac8f-bd9d1aedf2d2': 'Principles of Macroeconomics',
  'bf96bfc5-e723-46c2-9fa2-5a4c9294fa26': 'Concepts of Biology',
  '08df2bee-3db4-4243-bd76-ee032da173e8': 'Principles of Microeconomics',
  '02040312-72c8-441e-a685-20e9333f3e1d': 'Introduction to Sociology 2e',
  'd2fbadca-e4f3-4432-a074-2438c216b62a': 'Principles of Economics',
  '99e127f8-f722-4907-a6b3-2d62fca135d6': 'Anatomy and Physiology',
  '3402dc53-113d-45f3-954e-8d2ad1e73659': 'Concept of Biology', // Mini CC test version
  '185cbf87-c72e-48f5-b51e-f14f21b5eabd': 'Biology 2e', // non baked
  '8d50a0af-948b-4204-a71d-4826cba765b8': 'Biology 2e', // baked
  '405335a3-7cff-4df2-a9ad-29062a4af261': 'College Physics',
  '8d04a686-d5e8-4798-a27d-c608e4d0e187': 'College Physics',
  '6c322e32-9fb0-4c4d-a1d7-20c95c5c7af2': 'Biology for AP® Courses',
  'fbc61a81-d911-4fe5-bcc7-f1746dbbea18': 'APUSH', // title is not yet on errata form
};

export { BOOK_UID_XREF };

const Exercises = {

  troubleUrl({ bookUUID, project, exerciseId, chapter_section, title }) {
    const location = [];
    if (exerciseId) { location.push(exerciseId); }
    if (chapter_section) {
      location.push(chapter_section.toString());
    }

    if (title) { location.push(title); }

    const locationString = location.join(' ');

    const urlParams = {
      source: project, // either tutor or CC
      location: locationString,
      book: BOOK_UID_XREF[bookUUID],
    };

    return Exercises.ERRATA_FORM_URL + '?' + qs.stringify(omitBy(urlParams, isUndefined));
  },

  getParts(exercise) {
    return (exercise.content != null ? exercise.content.questions : undefined) || [];
  },
};


Exercises.ERRATA_FORM_URL = 'https://openstax.org/errata/form';
Exercises.setOSWebURL = (url) => {
  if (url) { Exercises.ERRATA_FORM_URL = `${url}/errata/form`; }
};

export default Exercises;
