const {
  Factory, sequence, APPEARANCE_CODES,
} = require('./helpers');

Factory.define('Note')
  .id(sequence)
  .page_id(sequence)
  .anchor('p-1234')
  .pageId(({ page }) => page ? page.id : null)
  .chapter_section(({ page }) => page ? page.chapter_section : [])
  .contents({
    content: '“physics”? Did you imagine ',
    endContainer: './*[name()=\'p\'][1]/text()[1]',
    endOffset: 77,
    id: '1550084152086',
    rect: { bottom: 765.921875, top: 745.921875, left: 602, right: 813 },
    referenceElementId: 'ea90794e-0043-4160-a494-3f370885c7e3',
    startContainer: './*[name()=\'p\'][1]/text()[1]',
    startOffset: 51,
    title: 'Connection for AP® Courses',
    type: 'XpathRangeSelector',
  })
