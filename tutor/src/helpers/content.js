import { isString, reduceRight } from 'lodash';

// Convert each number to base 10 with it's position based on index.
// If section is not present, 0 is set for it
//   1 becomes 100, 1.1 becomes 101, 3.2 to 302, 3.2.1 -> 30201
// Useful for sorting
export function chapterSectionToNumber(chapter_section) {
    if (isString(chapter_section)) { chapter_section = chapter_section.split('.'); }
    if (chapter_section.length === 1) { chapter_section.push(0); } // add a section 0 if it has only a chapter
    let position = -1;
    return reduceRight(chapter_section, (memo, num) => memo + (num * Math.pow(100, (position += 1)))
        , 0);
}

// uuid from validator library
const CNX_ID_REGEX = (
    /[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}@\d+(?:\.\d+)?/i
);

// looks for a uuid@version
export function extractCnxId(text) {
    const match = CNX_ID_REGEX.exec(text);
    return match ? match[0] : null;
}
