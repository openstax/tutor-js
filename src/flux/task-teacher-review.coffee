{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

TaskTeacherReviewConfig = {

}


extendConfig(TaskTeacherReviewConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TaskTeacherReviewConfig)
module.exports = {TaskTeacherReviewActions:actions, TaskTeacherReviewStore:store}
