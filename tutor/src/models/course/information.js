import String from '../../helpers/string';

const SUBJECTS = {
  PHYSICS:    'Physics',
  BIOLOGY:    'Biology',
  SOCIOLOGY:  'Sociology',
  ECONOMICS:  'Economics',
  MACRO_ECONOMICS: 'Macroeconomics',
  MICRO_ECONOMICS: 'Microeconomics',
  ANATOMY_PHYSIOLOGY: 'Anatomy & Physiology',
};


// NOTE:
//  * The 'biology' and 'physics' codes are deprecated, but are retained for older courses that may have them
//  * These codes must be kept in sync with the styles in variables/book-content.less
export default {
  physics: {
    title:      'Physics',
    subject:    SUBJECTS.PHYSICS,
  },
  hs_physics: {
    title:      'High School Physics',
    subject:    SUBJECTS.PHYSICS,
  },
  college_physics: {
    title:      'College Physics',
    subject:    SUBJECTS.PHYSICS,
  },
  biology: {
    title:      'Biology',
    subject:    SUBJECTS.BIOLOGY,
  },
  ap_biology: {
    title:      'Biology for AP® Courses',
    subject:    SUBJECTS.BIOLOGY,
  },
  concepts_biology: {
    title:      'Concepts of Biology',
    subject:    SUBJECTS.BIOLOGY,
  },
  college_biology: {
    title:      'College Biology',
    subject:    SUBJECTS.BIOLOGY,
  },
  principles_economics: {
    title:      'Principles of Economics',
    subject:    SUBJECTS.ECONOMICS,
  },
  macro_economics: {
    title:      'Macroeconomics',
    subject:    SUBJECTS.MACRO_ECONOMICS,
  },
  micro_economics: {
    title:      'Microeconomics',
    subject:    SUBJECTS.MICRO_ECONOMICS,
  },
  intro_sociology: {
    title:      'Introduction to Sociology',
    subject:    SUBJECTS.SOCIOLOGY,
  },
  anatomy_physiology: {
    title:      'Anatomy & Physiology',
    subject:    SUBJECTS.ANATOMY_PHYSIOLOGY,
  },

  forAppearanceCode(code) {
    return this[code] || { title: String.titleize(code), subject: '' };
  },
};
