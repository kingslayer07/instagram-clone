import React, {useState, useEffect } from 'react' ;
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import Post from './Post'
import { db, auth } from './firebase'
import { Button,Input } from '@material-ui/core';
import ImageUpload from './ImageUpload'
import Loading from './Loading'

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
  const [loading, setLoading] = useState(true)
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
      setLoading(true)
      db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot =>{
        // setting loading false
        setLoading(false)
        setPosts(snapshot.docs.map(doc => ({
          id:doc.id ,
          post: doc.data()
        })));
      })
     
   },[] )

  if(loading){
    
    
    return(
      <main >
        <Loading></Loading>
      </main>
    )
  } 
  return (
    <div  className="App">
    
    
    {/* signup modal render */}
      <Modal style={{backgroundColor:'#222224'}}
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
      
      <Input style={{color:'white'}}
        type="text"
        placeholder='username'
        value={username}
        onChange={(e) =>setUsername(e.target.value)}
      />
      <Input style={{color:'white'}}
        type="text"
        placeholder='email'
        value={email}
        onChange={(e) =>setEmail(e.target.value)}
      />
      <Input style={{color:'white'}}
        type="password"
        placeholder='password'
        value={password}
        onChange={(e) =>setPassword(e.target.value)}
      />
        <button style={{color:'white'}} className='buttonn' backgroundColor='#222224' type='submit' onClick={signup}>Sign Up </button>
      
                   
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
      
      
      <Input style={{color:'white'}}
        type="text"
        placeholder='email'
        value={email}
        onChange={(e) =>setEmail(e.target.value)}
      />
      <Input style={{color:'white'}}
        type="password"
        placeholder='password'
        value={password}
        onChange={(e) =>setPassword(e.target.value)}
      />
        <button style={{color:'white'}} className='buttonn' backgroundColor='#222224' type='submit' onClick={signup}>Sign In </button>
      
                   
      </form>
    </div>
        
      </Modal>
    
     {/* Header */}
     <div className='app_header'>
       <img
        className='app_headerImage'
        src="https://logodix.com/logo/836891.png" alt=""/>

     {user ? (
       <button className='buttonn' backgroundColor='#222224' onClick={ () => auth.signOut()}>LogOut</button>
     ): ( 
        <span>
          <button className='buttonn'  onClick={()=> setOpenSignIn(true)} >Sign In </button> 
          <button className='buttonn'  onClick={() =>setOpen(true)} >
            Sign Up
          </button>
          </span>

       
      ) }
     </div>
     <div>
    
     {/* posts */}
     {posts.map(( {id, post})=>{
       return (       
         <Post key={id} postId = {id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
)     } )}
     </div>
     

 {/* condition on user's logginn status */}
    {user?.displayName ? (
     <ImageUpload username={user.displayName} ></ImageUpload> 
      ) : (
        <h3>sorry, you aint signed in.</h3>
        )    
    }
   
    </div>
  );
}

export default App;

