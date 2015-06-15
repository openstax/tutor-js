{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

findAllPages = (section) ->
  pages = []
  if section.cnx_id
    pages.push(section)
  if section.children
    for child in section.children
      for page in findAllPages(child)
        pages.push(page)
  pages

ReferenceBookConfig = {

  exports:
    getToc: (courseId) ->
      @_get(courseId)['0']

    # We might consider caching this
    getPageInfo: ({courseId, cnxId}) ->
      toc = @_get(courseId)?['0']
      return unless toc
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
