import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register(){
    useEffect(() => {
        document.title = "Articulate | Register";
    }, []);
    const navigate = useNavigate();

    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/users/register', {username, password}, {withCredentials: true});
            if (username) navigate('/');
            else setMessage('User already exists!');

        } catch (err){
            setMessage(`User already exists.`);

        }
    }   
    
    return (
        <>
            <form className='register' onSubmit={handleSubmit}>
                <Link to='/'>↩</Link>
                <p>{message}</p>
                <input onChange={(e) => setUsername(e.target.value)} />
                <input onChange={(e) => setPassword(e.target.value)} type='password'/>
                <button>Submit</button>
            </form>
        </>
    )
}

export default Register;