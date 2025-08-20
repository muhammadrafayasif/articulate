import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
            await axios.post('http://localhost:5000/api/users/login', {username, password}, {withCredentials: true});
            if (username) navigate('/');
            else setMessage('Invalid Credentials');

        } catch (err){
            setMessage(`Invalid Credentials`);

        }
    }
    
    return (
        <>
            <form className='login' onSubmit={handleSubmit}>
                <Link to='/'>↩</Link>
                <p>{message}</p>
                <input onChange={(e) => setUsername(e.target.value)} />
                <input onChange={(e) => setPassword(e.target.value)} type='password'/>
                <button>Submit</button>
            </form>
        </>
    )
}

export default Login;