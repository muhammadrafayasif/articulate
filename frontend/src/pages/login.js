import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL;

function Login(){
    useEffect(() => {
        document.title = "Articulate | Login";
    }, []);
    const navigate = useNavigate();

    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/api/users/login`, {username, password}, {withCredentials: true});
            if (username) navigate('/');
            else setMessage('Invalid Credentials');

        } catch (err){
            setMessage(`Invalid Credentials`);

        }
    }
    
    return <LoginForm
        handleSubmit={handleSubmit}
        setUsername={setUsername}
        setPassword={setPassword}
        message={message}
    />
}

function LoginForm({ handleSubmit, setUsername, setPassword, message }){
    return (
        <>
            <form className='login' onSubmit={handleSubmit}>
                <Link to='/' className="go-back"><img style={{height: '1em', margin: 10}} src='https://cdn-icons-png.flaticon.com/512/190/190238.png' /></Link>
                <h1>Login</h1>
                <input placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} required />
                <input 
                    placeholder="Enter password" 
                    onChange={(e) => setPassword(e.target.value)} type='password' required
                    title="Password must be at least 8 characters and include uppercase, lowercase, number, and special character" />
                <button>Login</button>
                {message && <p className="error-message">{message}</p>}
            </form>
        </>
    )
}

export default Login;