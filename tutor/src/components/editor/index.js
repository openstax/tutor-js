import { React, useState, useMemo } from 'vendor';
import { ArbitraryHtmlAndMath as HTML } from 'shared';
import { Editor, convertToHTML, convertFromHTML, UICommand } from 'perry-white'
import { last } from 'lodash'

// import { Foo } from 'perry-white'


import 'perry-white/dist/styles.css'


class SaveCommand extends UICommand {

  constructor(onClick) {
    super()
    this.onClick = onClick
  }

  isEnabled() { return true }
  isActive() { return true }

  execute = (state) => {
    this.onClick(convertToHTML(state))
  }

//    isActive() { return true }
}

// debugger
// const sv = new SaveCommand()
// console.log(sv)


class EditorRuntime {

  constructor({ onSave }) {
    this.onSave = onSave // (html) => onSave(html)
  }
  // Image Upload
  canUploadImage() {
    return true
  }

  uploadImage(blob) {
    let img
    // Note: While looking at the uploadImage() function, it is found that a promise is resolved blindly after 3 seconds. Is it a
    // requirement? If not, then I think it causes two issues, 1. Even if an image upload finishes in 700ms, it will take 3s for
    // resolving the promise. 2. If the image upload takes more than 3s, then the promise will be incorrectly resolved before
    // completing the upload.
    // The following structure may be good to solve the issue.
    return new Promise((resolve, reject) => {
      // Use uploaded image URL.
      const url = window.location.protocol + '//' + window.location.hostname + ':3004/saveimage?fn=' + blob.name

      // POST(url, blob, 'application/octet-stream').then(data => {
      //   img = JSON.parse(data)
      //   resolve(img)
      // }, err => {
      //   img = {
      //     id: '',
      //     width: 0,
      //     height: 0,
      //     src: '',
      //   }
      //   resolve(img)
      // })
    })
  }

  // onSave = (html) => {
  //   debugger
  //   this._onSave()
  // }

  filterCommandGroups = (groups) => {


    last(groups)['[save] Save'] = (new SaveCommand(this.onSave))
    // groups.forEach(g => {
    //     delete g['[font_download] Font Type']
    // })

    return groups
  }
}


const Editing = ({ html, onSave }) => {

  const defaultEditorState = useMemo(() => convertFromHTML(html, null, null), [html]);
  const runtime = useMemo(() => new EditorRuntime({ onSave }), [onSave])

  return (

      <Editor
        defaultEditorState={defaultEditorState}
        height="100%" width="100%"
        runtime={runtime}
        fitToContent
      />

  );
};

const ClickToEdit = ({ html: defaultHTML }) => {
  const [isEditing, setEditing] = useState(false)
  const [currentHTML, setHTML] = useState(defaultHTML)
  const onSave = React.useCallback((html) => {
    if (html) {
      setHTML(html)
      setEditing(false)
    }
  }, [setEditing, setHTML])
  const body = isEditing ?
    <Editing html={currentHTML} onSave={onSave} /> : <HTML html={currentHTML} onClick={() => setEditing(true)}/>;

  return (
    <div style={{ margin: '100px auto', maxWidth: '1100px', height: '500px' }}>
      {body}
    </div>
  )

}


export { ClickToEdit }
