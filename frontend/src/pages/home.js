import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Markdown from 'react-markdown';
import { Filter } from "bad-words";
import '../stylesheets/Home.css';

const API_BASE = process.env.REACT_APP_API_URL;

function Home() {
    useEffect(() => {
        document.title = "Articulate";
    }, []);

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [userLoading, setUserLoading] = useState(true);
    const [postLoading, setPostLoading] = useState(true);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');

    const [posts, setPosts] = useState([]);
    const filter = new Filter();

    useEffect(() => {
        let controller = new AbortController();

        const fetchUser = async () => {
            try {
                const userRes = await axios.get(
                    `${API_BASE}/api/users/me`,
                    { withCredentials: true, signal: controller.signal }
                );
                setName(userRes.data.user.name);
            } catch (err) {
            if (axios.isCancel(err) || err.code === "ERR_CANCELED") return;
            } finally {
                setUserLoading(false);
            }
        };

        fetchUser();

        return () => controller.abort();
    }, []);

    useEffect(() => {
        let controller = new AbortController();

        const fetchPosts = async () => {
            try {
            const res = await axios.get(`${API_BASE}/api/post/`, { withCredentials: true, signal: controller.signal });
            setPosts(res.data);
            } catch (err) {
            console.error("Error fetching posts:", err);
            } finally {
            setPostLoading(false);
            }
        };

        fetchPosts();
        const interval = setInterval(fetchPosts, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (filter.isProfane(title) || filter.isProfane(content)) {
                setMessage('Profanity detected. Please avoid using it in your post.');
                return;
            }
            
            await axios.post(`${API_BASE}/api/post/new`, {title, content}, {withCredentials: true});
            setTitle('');
            setContent('');
            setMessage('Post created successfully!');
        } catch (err) {
            setMessage('Could not create new post.');
        }
    }

    const logout = async () => {
        try {
            await axios.post(`${API_BASE}/api/users/logout`, {}, {withCredentials: true});
            setName('');
            setUserLoading(false);
        } catch (err){
            console.error('Logout failed.')
        }
    }

    const deletePost = async (postId) => {
        try {  
            await axios.delete(`${API_BASE}/api/post/${postId}`, {withCredentials: true});
            setPosts(posts.filter(post => post._id !== postId));
        } catch (err) {
            console.error('Could not delete the post.');
        }
    }

    if (userLoading) return (
        <>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', 'height': '100vh'}}>
                <img alt='loading' width={80} src='https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUybHg5cmU5d3R1dHRnaGtrbG1rYzR3dWZwcG03bnc1anJvaXM3MjRrbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/FgH5xSNjGHZsiYPWAX/giphy.gif'/>
            </div>
        </>
    )

    return (
        <>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px'}}>
                <img width={350} alt='logo' src={`/logo-home.png`} />
            </div>
            <div className='home-header'>
                {name ? <h1 className='username'>Hi {name} 👋</h1> : <h1>No user connected 😞</h1>}
                {name ? <button className='logout' onClick={() => logout()}>Logout</button>:
                <>
                    <div className='home-links'>
                        <Link to='/login' className='link-button'>Login</Link>
                        <Link to='/register' className='link-button'>Register</Link>
                    </div>
                </>
                }
            </div>
            {name && 
                <>
                    <form onSubmit={handleSubmit}>
                        <h2>Create a new article</h2>
                        <input placeholder='Enter the title of the article' value={title} onChange={(e) => setTitle(e.target.value)} />
                        <textarea placeholder='Enter the content of the article (supports markdown)' value={content} onChange={(e) => setContent(e.target.value)} ></textarea>
                        <button>Post</button>
                        {message && <p className='error-message'>{message}</p>}
                    </form>
                </>
            }
            {
                postLoading ?
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px'}}>
                        <img alt='loading' width={80} src='https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUybHg5cmU5d3R1dHRnaGtrbG1rYzR3dWZwcG03bnc1anJvaXM3MjRrbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/FgH5xSNjGHZsiYPWAX/giphy.gif'/>
                    </div>
                :
                    <ul>
                        {posts.map((post) => {
                            return (
                                <li onClick={() => {
                                        navigate(`/post/${post._id}`);
                                    }} className='post' key={post._id}>
                                    {
                                        post.posted_by === name && <button onClick={(e) => {
                                            e.stopPropagation();
                                            deletePost(post._id)
                                        }} className='delete'>🗑️ Delete</button>
                                    }
                                    <h2 className='title'>{post.title}</h2>
                                    <hr/>
                                    <div onClick={() => console.log(post.content.slice(0,300))} className='content'>{post.content.length>300 ? <Markdown>{post.content.slice(0,300) + '...'}</Markdown> : <Markdown>{post.content}</Markdown>}</div>
                                    <p style={{fontWeight: 'bold'}} className='post-details'>✍️ Posted by: {post.posted_by} <br/>🗓️ Posted on: {new Date(post.createdAt).toLocaleString("en-US")}</p>
                                </li>     
                            )
                        })}
                    </ul>
            }


        </>
    )
}

export default Home;