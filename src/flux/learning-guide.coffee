{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

findAllSections = (section) ->
  sections = []
  if section.chapter_section?.length > 1
    sections.push(section)
  if section.children
    for child in section.children
      for section in findAllSections(child)
        sections.push(section)
  sections


LearningGuideConfig = {

  exports:
    getAllSections: (courseId) ->
      findAllSections(@_get(courseId))

    getSortedSections: (courseId, property = 'current_level') ->
      sections = findAllSections(@_get(courseId))
      _.sortBy(sections, property)



}


extendConfig(LearningGuideConfig, new CrudConfig())
{actions, store} = makeSimpleStore(LearningGuideConfig)
module.exports = {LearningGuideActions:actions, LearningGuideStore:store}
