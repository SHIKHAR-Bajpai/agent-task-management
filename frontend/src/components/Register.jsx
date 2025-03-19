import React, { useState } from 'react';
import { useNavigate , Link } from 'react-router-dom'; 
import Header from './Header';
import Footer from './Footer'; 
import axios from 'axios';
import config from '../../config';

const RegisterPage = () => {
  const navigate = useNavigate(); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (name && email && password) {
        try{
            console.log(config.API_URL)
            const reponse = await axios.post(`${config.API_URL}/api/user/register` , {name , email , password})

            console.log(reponse)
            if ( reponse.status === 201 ) {
                navigate('/login'); 
            }
        }catch(error){
            console.log(error)
            setError('Registration Failed. Please try again.' , error )
        } 
    }else{
        setError('Please Fill in all fields')
        }
    }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      <div className="flex-grow flex justify-center items-center">
        <div className="w-full max-w-sm p-6 bg-white shadow-lg rounded-lg">

          <h2 className="text-3xl font-bold text-center text-gray-800">Register</h2>
          {error && <p className="mt-2 text-red-500 text-center">{error}</p>}
          <form onSubmit={handleRegister} className="mt-4 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-600">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <Link to="/login" className='text-gray-500 mx-auto text-xs block text-center underline'>
            Already have an Account ?
            </Link>
            <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">Register</button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterPage;
