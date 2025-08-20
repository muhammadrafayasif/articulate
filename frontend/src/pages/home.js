import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import '../stylesheets/Home.css';

function Home() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const controller = new AbortController();

        const fetchUser = async () => {
            try {
            const userRes = await axios.get(
                "http://localhost:5000/api/users/me",
                { withCredentials: true, signal: controller.signal }
            );
            setName(userRes.data.user.name);
            } catch (err) {
            if (axios.isCancel(err) || err.code === "ERR_CANCELED") return;
            } finally {
            setLoading(false);
            }
        };

        fetchUser();

        return () => controller.abort();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
            const res = await axios.get("http://localhost:5000/api/post/");
            setPosts(res.data);
            } catch (err) {
            console.error("Error fetching posts:", err);
            }
        };

        fetchPosts();
        const interval = setInterval(fetchPosts, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/post/new', {title, content}, {withCredentials: true})
                .then( (newPost) => setPosts([...posts, newPost.data]) );
            setTitle('');
            setContent('');
        } catch (err) {
            console.error('Could not create new post.');
        }
    }

    const logout = async () => {
        try {
            await axios.post('http://localhost:5000/api/users/logout', {}, {withCredentials: true});
            setName('');
            setLoading(false);
        } catch (err){
            console.error('Logout failed.')
        }
    }

    if (loading) return <p>Loading...</p>;

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
                        <input value={title} onChange={(e) => setTitle(e.target.value)} />
                        <textarea value={content} onChange={(e) => setContent(e.target.value)} ></textarea>
                        <button>Post</button>
                    </form>
                </>
            }
            <ul>
                {posts.map((post) => {
                    return (
                        <li key={post._id}>
                            <h2 onClick={() => {
                                navigate(`/post/${post._id}`);
                            }} className='title'>{post.title}</h2>
                            <hr/>
                            <p className='content'>{post.content.length>300 ? post.content.slice(0,300) + '...' : post.content}</p>
                            <p style={{fontWeight: 'bold'}} className='posted-by'>Posted by: {post.posted_by}</p>
                        </li>     
                    )
                })}
            </ul>


        </>
    )
}

export default Home;