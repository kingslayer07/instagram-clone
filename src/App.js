import React, {useState, useEffect } from 'react' ;
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

import './App.css';
import Post from './Post'
import { db, auth } from './firebase'
import { Button,Input } from '@material-ui/core';
import ImageUpload from './ImageUpload'
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
  const [openSignIn, setOpenSignIn] = useState(false)
  const [posts, setPosts] = useState([]) 
  const classes = useStyles()
  const [modalStyle] = React.useState(getModalStyle);
  
  const [user, setUser] = useState(null)
  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser) =>{
      if(authUser) {
        // user has logged in ...
        console.log(authUser)
        setUser(authUser)
        if(authUser.displayName) {
          // dont update username

        }else{
          // new user...
          return authUser.updateProfile({
            displayName: username
          })
        }
      }
      else{
        // user logged out...
        setUser(null) 
      }
    })
    return () =>{
      unsubscribe()
    }
  },[user, username])
// logic for signup
  const signup = (event) => {
    event.preventDefault()
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser)=>{
        authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error)=> alert(error.message));
      setOpen(false)

  }
  // logic for signin
  const signIn = (event) => {
    event.preventDefault()
    auth
      .signInWithEmailAndPassword(email, password)
      // .then((authUser)=>{
      //   authUser.user.updateProfile({
      //     displayName: username
      //   })
      // })
      .catch((error)=> alert(error.message));
      setOpenSignIn(false)

  }

  //rendering posts 
  useEffect(() =>{
      db.collection('posts').onSnapshot(snapshot =>{
        setPosts(snapshot.docs.map(doc => ({
          id:doc.id ,
          post: doc.data()
        })));
      })
     
   },[] )
  return (
    <div className="App">
    {/* condition on user's logginn status */}
    {user?.displayName ? (
     <ImageUpload username={user.displayName} ></ImageUpload> 
      ) : (
        <h3>sorry, you aint signed in.</h3>
        )    
    }
    
    
    {/* signup modal render */}
      <Modal
        open={open}
        onClose={()=> setOpen(false)}
      >
       <div style={modalStyle} className={classes.paper}>
      <form className='app_signup'>
      {/* displaying content of signup - instagram logo , name ,email password fields  */}
      <center>
        <img
        className='app_headerImage'
        src="https://logodix.com/logo/836891.png" alt=""/>
       </center>
      
      <Input 
        type="text"
        placeholder='username'
        value={username}
        onChange={(e) =>setUsername(e.target.value)}
      />
      <Input 
        type="text"
        placeholder='email'
        value={email}
        onChange={(e) =>setEmail(e.target.value)}
      />
      <Input 
        type="password"
        placeholder='password'
        value={password}
        onChange={(e) =>setPassword(e.target.value)}
      />
        <Button type='submit' onClick={signup}>Sign Up </Button>
      
                   
      </form>
    </div>
        
      </Modal>
      {/* Modal for signin */}
      <Modal
        open={openSignIn}
        onClose={()=> setOpenSignIn(false)}
      >
       <div style={modalStyle} className={classes.paper}>
      <form className='app_signup'>
      {/* displaying content of signup - instagram logo , name ,email password fields  */}
      <center>
        <img
        className='app_headerImage'
        src="https://logodix.com/logo/836891.png" alt=""/>
       </center>
      
      
      <Input 
        type="text"
        placeholder='email'
        value={email}
        onChange={(e) =>setEmail(e.target.value)}
      />
      <Input 
        type="password"
        placeholder='password'
        value={password}
        onChange={(e) =>setPassword(e.target.value)}
      />
        <Button type='submit' onClick={signIn}>Sign In </Button>
      
                   
      </form>
    </div>
        
      </Modal>
    
     {/* Header */}
     <div className='app_header'>
       <img
        className='app_headerImage'
        src="https://logodix.com/logo/836891.png" alt=""/>
     </div>

     {user ? (
       <Button onClick={ () => auth.signOut()}>LogOut</Button>
     ): ( 
       <div>
      <Button onClick={()=> setOpenSignIn(true)} >Sign In </Button> 
     <Button className='button' onClick={() =>setOpen(true)} variant="contained" color="primary" component="span">
          Sign Up
        </Button>

       </div>
      ) }
     {/* posts */}
     {posts.map(( {id, post})=>{
       return (       
         <Post key={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
)     } )}
    </div>
  );
}

export default App;
