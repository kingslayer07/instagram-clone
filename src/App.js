 import React, {useState, useEffect } from 'react' ;
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

import './App.css';
import Post from './Post'
import { db,  Input } from './firebase'
import { Button } from '@material-ui/core';

function getModalStyle() {
  const top = 50 
  const left = 50 

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {

  const [username, setUsername] =useState('')
  const [email, setEmail] =useState('')
  const [password, setPassword] =useState('')

  const [open, setOpen] = useState(false)
  const [posts, setPosts] = useState([]) 
  const classes = useStyles()
  const [modalStyle] = React.useState(getModalStyle);
  const signup = (event) => {
    
  }
  useEffect(() =>{
      db.collection('posts').onSnapshot(sanphot =>{
        setPosts(sanphot.docs.map(doc => ({
          id:doc.id ,
          post: doc.data()
        })));
      })
     
   },[] )
  return (
    <div className="App">
    <Modal
        open={open}
        onClose={()=> setOpen(false)}
      >
       <div style={modalStyle} className={classes.paper}>
      <form  className='app_signup'>

      <center>
        <img
        className='app_headerImage'
        src="https://logodix.com/logo/836891.png" alt=""/>
      <input 
        type="text"
        placeholder='username'
        value={username}
        onChange={(e) =>setUsername(e.target.value)}
      />
      <input 
        type="text"
        placeholder='email'
        value={email}
        onChange={(e) =>setEmail(e.target.value)}
      />
      <input 
        type="password"
        placeholder='password'
        value={password}
        onChange={(e) =>setPassword(e.target.value)}
      />
      <Button onClick={signup}>Sign Up </Button>             
       </center>
      </form>
    </div>
        
      </Modal>
    
     {/* Header */}
     <div className='app_header'>
       <img
        className='app_headerImage'
        src="https://logodix.com/logo/836891.png" alt=""/>
     </div>
     
     <Button className='button' onClick={() =>setOpen(true)} variant="contained" color="primary" component="span">
          Upload
        </Button>
     {/* posts */}
     {posts.map(( {id, post})=>{
       return (       
         <Post key={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
)     } )}
    </div>
  );
}

export default App;
