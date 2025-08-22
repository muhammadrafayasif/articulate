import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Markdown from "react-markdown";
import axios from "axios";

function Post() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    axios.get(`https://backend-articulate.vercel.app/api/post?id=${id}`, { withCredentials: true })
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
                <div className="content">
                    <Markdown style={{marginLeft: '10px'}}>{content}</Markdown>
                </div>
            </div>
        </>
    );
}

export default Post;