import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function Post() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    axios.get(`http://localhost:5000/api/post?id=${id}`, { withCredentials: true })
        .then((response) => {
            setTitle(response.data.title);
            setContent(response.data.content);
        })
        .catch((error) => {
            console.error("Error fetching post:", error);
        });
    return (<>
            <Link to='/' className="go-back">↩</Link>
            <br/>
            <div className='post-page'>
                <h1 onClick={(e) => e.preventDefault()} className="title">{title}</h1>
                <p style={{marginLeft: '10px'}}>{content}</p>
            </div>
        </>
    );
}

export default Post;