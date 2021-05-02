import React, {useState, useEffect} from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar'
import { db } from './firebase'
import { firebase } from '@firebase/app';
import '@firebase/firestore'
import { FaRegHeart, FaRegComment } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';



// link for like button feature
// https://codepen.io/bneupane/pen/KMKzZZ

function Post({ postId,user ,username, caption, imageUrl}) {

    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
     const [commentSection, setCommentSection] = useState(false)   
    const postComment = (event) =>{
        event.preventDefault()
        
        db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        setComment('')
        
    }

    useEffect(() => {
        let  unsubscribe;
        if(postId) {
             db
             .collection('posts')
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) =>{
                    setComments(snapshot.docs.map((doc) => doc.data()))
                })
            }
            return () => {
                unsubscribe()
            }
        }, [postId])
    return (
        <div className='post'>
            
            <div className='post_header'>
                <Avatar
                className="post_avatar"
                alt= {username}
                src='dsfsd'
             />
            <h3 style={{backgroundColor:'#222224'}}>{username}</h3>
            </div>
            
            {/*header -> avatar + username */}
            <img className='post_image' src={imageUrl} alt=""/>
            {/* image */}
            {/* username + caption */}
            <div className='buttons'>
                <button   className='likeButton'> 
                    <FaRegHeart color="white"  style={{backgroundColor:'#222224'}} cursor= "pointer" size='29px' /> 
                </button>
                <button  className='commentButton' onClick = {()=> setCommentSection(!commentSection)}> 
                    <FaRegComment color="white" style={{backgroundColor:'#222224'}} cursor= "pointer" size='29px' /> 
                    
                </button>
                <button  className='sendButton'> 
                    <FiSend color="white" style={{backgroundColor:'#222224'}} cursor="pointer"  size='29px' /> 
                    
                </button>
            </div>
            <h4 className='post_text' style={{backgroundColor:'#222224'}} > <strong style={{backgroundColor:'#222224'}}>{username}</strong> {caption}</h4>
            
            <div className='post_comments' >
                { comments.map((comment) => {
                    return ( 
                    <>
                    
                    <p style={{backgroundColor:'#222224'}}>
                        <strong style={{backgroundColor:'#222224'}} >{comment.username} </strong>{comment.text}
                    </p>
                    </>)
                })}
            </div>
            {user && commentSection &&(

           <form className='post_commentBox'>
                <input 
                    type="text"
                    className='post_input'
                    placeholder='add a comment...'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button 
                    className='post_button'
                    disabled={!comment}
                    type='submit'
                    onClick={postComment}
                >
                Post
                </button>
            </form>
            )
            
            }

        </div>
    )
}

export default Post
