ROUTES = [{
  subject: 'exercise'
  method: 'GET'
  pattern: 'exercises/{id}'
}, {
  subject: 'exercise'
  method: 'PUT'
  pattern: 'exercises/{id}@draft'
  action: 'update'
}, {
  subject: 'exercise'
  method: 'POST'
  pattern: 'exercises'
}, {
  subject: 'exercise'
  method: 'PUT'
  pattern: 'exercises/{uid}/publish'
  action: 'publish'
}, {
  subject: 'exercise-attachment'  
  method: 'DELETE'
  pattern: 'exercises/{exerciseUid}/attachments/{attachmentId}'
}, {
  subject: 'vocabulary'  
  method: 'GET'
  pattern: 'vocab_terms/{id}'
}, {
  subject: 'vocabulary'  
  method: 'POST'
  pattern: 'vocab_terms'
}, {
  subject: 'vocabulary'
  method: 'PUT'
  pattern: 'vocab_terms/{id}@draft'
  action: 'update'
}, {
  subject: 'vocabulary'
  method: 'PUT'
  pattern: 'vocab_terms/{uid}/publish'
  action: 'publish'
}]

module.exports = ROUTES
