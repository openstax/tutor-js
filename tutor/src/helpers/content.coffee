_ = require 'underscore'


module.exports = {

  # Convert each number to base 10 with it's position based on index.
  # If section is not present, 0 is set for it
  #   1 becomes 100, 1.1 becomes 101, 3.2 to 302, 3.2.1 -> 30201
  # Useful for sorting
  chapterSectionToNumber: (chapter_section) ->
    chapter_section = chapter_section.split('.') if _.isString(chapter_section)
    chapter_section.push(0) if chapter_section.length is 1 # add a section 0 if it has only a chapter
    position = -1
    _.reduceRight(chapter_section, (memo, num) ->
      memo + (num * Math.pow(100, position += 1))
    , 0)


}
