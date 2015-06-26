{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

findAllPages = (section) ->
  pages = []
  if section.cnx_id and "page" is section.type
    pages.push(section)
  if section.children
    for child in section.children
      for page in findAllPages(child)
        pages.push(page)
  pages

findChapterSection = (section, chapterNumber) ->
  if _.first(section.chapter_section) is chapterNumber and "part" is section.type
    return section
  if section.children
    for child in section.children
      return found if found = findChapterSection(child, chapterNumber)
  null

ReferenceBookConfig = {

  exports:
    getToc: (courseId) ->
      @_get(courseId)['0']

    getChapterFirstPage: (courseId, chapterId) ->
      toc = @_get(courseId)?['0']
      section = findChapterSection(toc, parseInt(chapterId, 10))
      _.first(section?.children)

    getPages: (courseId) ->
      toc = @_get(courseId)?['0']
      return [] unless toc
      findAllPages(toc)

    # We might consider caching this
    getPageInfo: ({courseId, cnxId}) ->
      toc = @_get(courseId)?['0']
      return {} unless toc
      pages = findAllPages(toc)
      lastPage = null
      for page, index in pages
        unless -1 is page.cnx_id.indexOf(cnxId)
          return _.extend(_.clone(page), {prev: lastPage, next: pages[index + 1] })
        lastPage = page
}

extendConfig(ReferenceBookConfig, new CrudConfig())
{actions, store} = makeSimpleStore(ReferenceBookConfig)
module.exports = {ReferenceBookActions:actions, ReferenceBookStore:store}
