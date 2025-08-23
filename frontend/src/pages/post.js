import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Markdown from "react-markdown";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL;

function Post() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            axios.get(`${API_BASE}/api/post?id=${id}`, { withCredentials: true })
            .then((response) => {
                setTitle(response.data.title);
                setContent(response.data.content);
            })
            .catch((error) => {
                console.error("Error fetching post:", error);
            });
        } catch (err) {
            console.error("Error fetching post:", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    if (loading) return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <img alt='loading' width={80} src='https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUybHg5cmU5d3R1dHRnaGtrbG1rYzR3dWZwcG03bnc1anJvaXM3MjRrbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/FgH5xSNjGHZsiYPWAX/giphy.gif'/>
        </div>
    );

    return (
        <>
            <Link to='/' className="go-back">↩</Link>
            <br/>
            <div className='post-page'>
                {title && <h1 style={{margin: '10px', backgroundColor: 'darkred', padding: 10, borderRadius: '4px'}} onClick={(e) => e.preventDefault()} className="title">{title}</h1>}
                <div className="content">
                    <Markdown style={{margin: '10px'}}>{content}</Markdown>
                </div>
            </div>
        </>
    );
}

export default Post;