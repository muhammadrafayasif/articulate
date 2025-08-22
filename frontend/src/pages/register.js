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
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }
        try {
            await axios.post('https://backend-articulate.vercel.app/api/users/register', {username, password}, {withCredentials: true});
            if (username) navigate('/');
            else setMessage('User already exists!');

        } catch (err){
            setMessage(`User already exists.`);

        }
    }   
    
    return (
        <>
            <form className='register' onSubmit={handleSubmit}>
                <Link to='/' className="go-back">↩</Link>
                <h1>Register</h1>
                <input placeholder="Enter username"  onChange={(e) => setUsername(e.target.value)} />
                <input 
                    name="password"
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$" 
                    placeholder="Enter password" 
                    onChange={(e) => setPassword(e.target.value)} type='password' required
                    title="Password must be at least 8 characters and include uppercase, lowercase, number, and special character" />
                <input name="confirm_password" placeholder="Confirm password" onChange={(e) => setConfirmPassword(e.target.value)} type="password" />
                <button>Register</button>
                {message && <p className="error-message">{message}</p>}
            </form>
        </>
    )
}

export default Register;