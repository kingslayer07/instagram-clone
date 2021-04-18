import React,  {useState} from 'react'
import {Button} from '@material-ui/core'
import {db, storage} from './firebase'
import { firebase } from '@firebase/app';
import '@firebase/firestore'


function ImageUpload({username}) {
    const [image, setImage] = useState(null) 
    const [progress, setProgress] = useState(0)
    const [caption, setCaption] = useState('')
    
    const handleChange = (e) =>{
        // if by mistake i select 2 files then choose the first one
            if(e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }
    const handleUpload =() =>{
         const uploadTask = storage.ref(`images/${image.name}`).put(image)

         uploadTask.on(
             'static_changed',
             (snaopshot)=>{
                 //progress function ...
                 const progress = Math.round(
                     (snaopshot.bytesTransferred/snaopshot.totalBytes) +100
                 )
                 setProgress(progress)
             },
             //error function
             (error) =>{
                 console.log(error)
                 alert(error.message)
             },
             //complete function
             () =>{
                 storage
                 .ref('images')
                 .child(image.name)
                 .getDownloadURL()
                 .then(url =>{
                     db.collection('posts').add({
                         // to sort posts by time
                         timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                         caption: caption,
                         imageUrl: url,
                         username: username
                    })
                    setProgress(0)
                    setCaption('')
                    setImage(null)
                 })
             }
         )

    }

    return (
        <div> 
        <h2>hemlo</h2>
        <progress value={progress} max='100' />
     {/* caption input */}
     <input type="text" placeholder='Caption comes here.' onChange={event=> setCaption(event.target.value)} />
     {/* file picker */}
     <input type="file" onChange={handleChange}/>
     {/* post button             */}
     <Button onClick={handleUpload}>Upload</Button> 
        </div>
    )
}

export default ImageUpload
