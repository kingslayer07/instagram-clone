import React from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar'
function Post({username, caption, imageUrl}) {
    return (
        <div className='post'>
            <div className='post_header'>
                <Avatar
                className="post_avatar"
                alt= {username}
                src='dsfsd'
             />
            <h3 style={{backgroundColor:'#242526'}}>{username}</h3>
            </div>
            
            {/*header -> avatar + username */}
            <img className='post_image' src={imageUrl} alt=""/>
            {/* image */}
            {/* username + caption */}
            <h4 className='post_text' style={{backgroundColor:'#242526'}} > <strong style={{backgroundColor:'#242526'}}>{username}</strong> {caption}</h4>
        </div>
    )
}

export default Post
