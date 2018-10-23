import _ from 'underscore';


export default {
  // Convert each number to base 10 with it's position based on index.
  // If section is not present, 0 is set for it
  //   1 becomes 100, 1.1 becomes 101, 3.2 to 302, 3.2.1 -> 30201
  // Useful for sorting
  chapterSectionToNumber(chapter_section) {
    if (_.isString(chapter_section)) { chapter_section = chapter_section.split('.'); }
    if (chapter_section.length === 1) { chapter_section.push(0); } // add a section 0 if it has only a chapter
    let position = -1;
    return _.reduceRight(chapter_section, (memo, num) => memo + (num * Math.pow(100, (position += 1)))
      , 0);
  },
};
