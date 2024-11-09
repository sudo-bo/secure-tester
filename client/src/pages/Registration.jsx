import axios from 'axios';
import React, { useState } from 'react'
import {toast} from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Registration() {
const navigate = useNavigate();
 const [data, setData] = useState({
    name:"",
    email:"",
    password:""
 });

 const registerUser = async (e) =>{
    e.preventDefault();
    const {name,email,password} = data;
    try{
        const {data} = await axios.post('/registerUser',{
            name,email,password
        });
        if(data.error){
            toast.error(data.error);
        }else{
            setData({});
            toast.success('Registration Successfull');
            navigate('/login');
        }
    }catch(error){
        console.log(error);
    }
 }

  return (
    <div>
        <form  onSubmit={registerUser}>
            <label>Name</label>
            <input type="text" value={data.name} onChange={(e) => setData({...data, name:e.target.value})} />
            <label>Email</label>
            <input type="email" value={data.email} onChange={(e) => setData({...data, email:e.target.value})} />
            <label>Password</label>
            <input type="password" value={data.password} onChange={(e) => setData({...data, password:e.target.value})} />
            <button type='submit'>Submit</button>
        </form>
    </div>
  )
}