import { Link, useNavigate } from 'react-router-dom';
import { updateDoc, doc } from 'firebase/firestore';
import { auth, db } from "../config/firebase";
import { useState } from 'react';
import { useSnackbar } from "notistack";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useGetUserData } from '../hooks/useGetUserData';

const Login = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const navigate = useNavigate();
    const defaultPhoto = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png';
    const photo = auth?.currentUser?.photoURL || defaultPhoto;
    const { uData } = useGetUserData();

    const login = async () => {
        if (email === '' || pwd === '') return;
        const matchingUser = uData.find((user) => email === user.uemail && pwd === user.upassword);
        // console.log(matchingUser);
        if (matchingUser) {
            if (!auth.currentUser) {
                try {
                    const uID = uData.find((user) => email === user.uemail && pwd === user.upassword)?.id;

                    if (uID) {
                        await updateDoc(doc(db, 'users', uID), {
                            isLoggedOut: false
                        });
                        await signInWithEmailAndPassword(auth, email, pwd);
                    } else {
                        console.error("User ID not found");
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            navigate('/chat');
            enqueueSnackbar('Login successfully', { variant: 'success' });
        } else if (uData.find((user) => email === user.uemail || pwd === user.upassword)) {
            enqueueSnackbar('Please enter the correct email and password', { variant: 'error' });
        } else {
            enqueueSnackbar('Please sign up for an account first', { variant: 'error' });
        }
    };


    return (
        <section className='bg-slate-300 h-screen absolute top-0 w-full min-w-[700px]'>
            <div className='bg-white rounded w-[700px] h-[630px] relative mx-auto mt-[200px]'>
                <div className='flex flex-col items-center pb-5'>
                    <div className='mt-5 mb-3 w-[100px] h-[100px] rounded-full overflow-hidden border-10 border-gray shadow-md'>
                        <img src={photo} alt="Login Gif" className='m-auto h-full' />
                    </div>
                    <h1 className='text-4xl mb-5'>Welcome back</h1>
                    <small className='text-gray-500'>Glad to see you again 👋</small>
                    <small className='text-gray-500'>Login to your account below</small>
                </div>
                <div className='p-4 w-2/3 space-y-3 flex items-center mx-auto flex-col'>
                    <div className='flex flex-col w-full'>
                        <label>Email</label>
                        <input
                            className="p-2 mt-3 rounded border"
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col w-full'>
                        <label>Password</label>
                        <input
                            className="p-2 mt-3 rounded border"
                            type="password"
                            onChange={(e) => setPwd(e.target.value)}
                        />
                    </div>
                </div>
                <div className='mt-5 ml-[170px]'>
                    <button
                        onClick={login}
                        className='bg-[#4F2ED8] w-[350px] p-2 rounded text-white hover:bg-[#3c1eb7]'>
                        Login
                    </button>
                </div>
                <div className='ml-[230px] mt-5'>
                    <small>
                        <span className='mr-3'>
                            Dont have an account?
                        </span>
                        <Link to='/' className='underline cursor-pointer text-blue-500'>
                            Sign up for Free
                        </Link>
                    </small>
                </div>
            </div>
        </section>
    )
}

export default Login