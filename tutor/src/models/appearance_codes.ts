import { invert } from 'lodash';

const AppearanceCodes = {
    ap_biology:       'Biology for AP® Courses',
    ap_physics:       'College Physics for AP® Courses',
    biology_2e:       'Biology 2e',
    college_biology:  'College Biology',
    college_physics:  'College Physics',
    concepts_biology: 'Concepts of Biology',
    entrepreneurship: 'Entrepreneurship',
    hs_physics:       'High School Physics',
    intro_sociology:  'Introduction to Sociology',
    ap_us_history:    'Life, Liberty, Pursuit of Happiness',
    macro_economics:  'Macro Economics',
    micro_economics:  'Micro Economics',
};

const BookTitles = invert(AppearanceCodes);

export { BookTitles, AppearanceCodes };
