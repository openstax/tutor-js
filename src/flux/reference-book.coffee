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

findChapterSection = (section, chapter_section) ->
  if _.isEqual(section.chapter_section, chapter_section)
    return section
  if section.children
    for child in section.children
      return found if found = findChapterSection(child, chapter_section)
  null

ReferenceBookConfig = {

  exports:
    getToc: (bookId) ->
      @_get(bookId)['0']

    getFirstSection: (bookId) ->
      toc = @_get(bookId)?['0']
      return null unless toc?.children?

      {children} = toc
      _.chain(children)
        .sortBy((child) ->
          child.chapter_section
        )
        .first()
        .value()?.chapter_section

    # Takes a bookId and a chapter_section specifier
    # which is a string joined with dots i.e. "1.2.3"
    getChapterSectionPage: ({bookId, section}) ->
      parts = _.map(section.split('.'), (part) -> parseInt(part, 10) )
      toc = @_get(bookId)?['0']
      section = findChapterSection(toc, parts)
      if section
        if section.type is "part"
          _.first(section?.children)
        else
          section
      else
        null

    getPageTitle: ({bookId, section}) ->
      return null unless section?
      section = section.split('.') unless _.isArray(section)
      toc = @_get(bookId)?['0']
      section = _.map(section, (n) -> parseInt(n))
      findChapterSection(toc, section)?.title

    getPages: (bookId) ->
      toc = @_get(bookId)?['0']
      return [] unless toc
      findAllPages(toc)

    # We might consider caching this
    getPageInfo: ({bookId, cnxId}) ->
      toc = @_get(bookId)?['0']
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
