import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Markdown from 'react-markdown';
import Filter from "bad-words";
import '../stylesheets/Home.css';

function Home() {
    useEffect(() => {
        document.title = "Articulate";
    }, []);

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');

    const [posts, setPosts] = useState([]);
    const filter = new Filter();

    useEffect(() => {
        const controller = new AbortController();

        const fetchUser = async () => {
            try {
            const userRes = await axios.get(
                "https://backend-articulate.vercel.app/api/users/me",
                { withCredentials: true, signal: controller.signal }
            );
            setName(userRes.data.user.name);
            } catch (err) {
            if (axios.isCancel(err) || err.code === "ERR_CANCELED") return;
            }
        };

        fetchUser();

        return () => controller.abort();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
            const res = await axios.get("https://backend-articulate.vercel.app/api/post/", { withCredentials: true});
            setPosts(res.data);
            } catch (err) {
            console.error("Error fetching posts:", err);
            } finally {
            setLoading(false);
            }
        };

        fetchPosts();
        const interval = setInterval(fetchPosts, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!filter.isProfane(input)){
                setMessage('Please avoid using profanity in your post.');
                return;
            }
            
            await axios.post('https://backend-articulate.vercel.app/api/post/new', {title, content}, {withCredentials: true});
            setTitle('');
            setContent('');
            setMessage('Post created successfully!');
        } catch (err) {
            setMessage('Could not create new post.');
        }
    }

    const logout = async () => {
        try {
            await axios.post('https://backend-articulate.vercel.app/api/users/logout', {}, {withCredentials: true});
            setName('');
            setLoading(false);
        } catch (err){
            console.error('Logout failed.')
        }
    }

    if (loading) return (
        <>
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
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px'}}>
                <img width={80} src='https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUybHg5cmU5d3R1dHRnaGtrbG1rYzR3dWZwcG03bnc1anJvaXM3MjRrbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/FgH5xSNjGHZsiYPWAX/giphy.gif'/>
            </div>
        </>
    )

    return (
        <>
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
                        <h2>Create a new post</h2>
                        <input placeholder='Enter the title of the article' value={title} onChange={(e) => setTitle(e.target.value)} />
                        <textarea placeholder='Enter the content of the article (supports markdown)' value={content} onChange={(e) => setContent(e.target.value)} ></textarea>
                        <button>Post</button>
                        {message && <p className='error-message'>{message}</p>}
                    </form>
                </>
            }
            <ul>
                {posts.map((post) => {
                    return (
                        <li onClick={() => {
                                navigate(`/post/${post._id}`);
                            }} className='post' key={post._id}>
                            <h2 className='title'>{post.title}</h2>
                            <hr/>
                            <div onClick={() => console.log(post.content.slice(0,300))} className='content'>{post.content.length>300 ? <Markdown>{post.content.slice(0,300) + '...'}</Markdown> : <Markdown>{post.content}</Markdown>}</div>
                            <p style={{fontWeight: 'bold'}} className='posted-by'>Posted by: {post.posted_by} <br/> Posted on: {new Date(post.createdAt).toLocaleString("en-US")}</p>
                        </li>     
                    )
                })}
            </ul>


        </>
    )
}

export default Home;