import { React, useState, useMemo } from 'vendor';
import { ArbitraryHtmlAndMath as HTML } from 'shared';
import { Editor, convertFromHTML, Foo as PWFoo, UICommand } from 'perry-white'
import { last } from 'lodash'
import { Foo as FormialFoo } from 'formial';
// import { Foo } from 'perry-white'


// import 'perry-white/dist/styles.css'

class A extends FormialFoo {

}

class B extends PWFoo {

}


console.log(
  "FORMIAL", new A(),
)

console.log(
  "PW",  new B(),
)


class SaveCommand extends Foo {

  constructor() {
    super()
  }

    //isEnabled() { return true }

    isActive = (state) => {
        return true
    }
    isEnabled = (state) => {
        return true
    }

    execute = () => {
        debugger
    }

//    isActive() { return true }
}

// debugger
// const sv = new SaveCommand()
// console.log(sv)


class EditorRuntime {

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

  filterCommandGroups(groups) {


    last(groups)['[save] Save:'] = (new SaveCommand())
    // groups.forEach(g => {
    //     delete g['[font_download] Font Type']
    // })
    console.log("FILTER", groups)
    return groups
  }
}


const Editing = ({ html }) => {

  const defaultEditorState = useMemo(() => convertFromHTML(html, null, null), [html]);
  const runtime = useMemo(() => new EditorRuntime(), [])

  return (
    <div style={{ margin: '100px auto', maxWidth: '1100px', height: '500px' }}>

      <Editor
        defaultEditorState={defaultEditorState}
        height="100%" width="100%"
        runtime={runtime}
        fitToContent
      />

    </div>
  );
};


const ClickToEdit = ({ html }) => {
  return <p>hi</p>

  const [isEditing, setEditing] = useState(true)
  const [currentHTML, setHTML] = useState(html)

  if (isEditing) {
    return <Editing html={currentHTML} />
  }
  return <HTML html={currentHTML} onClick={() => setEditing(true)}/>

}


export { ClickToEdit }

