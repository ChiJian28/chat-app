import { signup } from '../assets';
import { Link, useNavigate } from 'react-router-dom';
import GoogleButton from 'react-google-button';
import { auth, googleProvider, storage, db } from "../config/firebase";
import Cookies from "universal-cookie";
import { useSnackbar } from "notistack";
import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDocs, collection, addDoc, updateDoc, doc, query, where } from 'firebase/firestore';
import Loader from '../components/Loader';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const navigate = useNavigate();
    const cookies = new Cookies();
    const { enqueueSnackbar } = useSnackbar();
    const usersCollectionRef = collection(db, 'users');
    const [userName] = email.split('@');
    const [fileUpload, setFileUpload] = useState(null);
    const filesFolderRef = ref(storage, `UserProfilePhotos/${fileUpload?.name}`);
    const [isLoading, setIsLoading] = useState(false);
    const defaultPhoto = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png';      

    const checkIfUserExists = async () => {
        const queryUser = query(usersCollectionRef, where('uid', '==', auth?.currentUser?.uid));
        const snapshot = await getDocs(queryUser);      // getDocs is one-time fetch of the data（retrieves the current data）
    
        if (snapshot.empty) {
            console.log('User does not exist in Firestore, So I will push user to Firestore');
            pushUser();
        } else {
            snapshot.forEach(async (e) => {
                await updateDoc(doc(db, 'users', e.id), {
                    isLoggedOut: false,
                });
                console.log('User exists in Firestore, not gonna pushing');
            });
        }
    };
    
    const pushUser = async () => {
        await addDoc(usersCollectionRef, {
            uname: auth.currentUser?.displayName,
            uphoto: auth.currentUser?.photoURL,
            uid: auth.currentUser?.uid,
            isLoggedOut: false,
        })
        console.log("Push successfully");
    };

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            checkIfUserExists();
            cookies.set('auth-token', result.user.refreshToken);
            enqueueSnackbar('Sign in successfully', { variant: 'success' });
            navigate('/chat');
        } catch (error) {
            console.error(error);
        }
    };


    const signUpWithEP = async () => {
        setIsLoading(true);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, pwd);
            await uploadFile();
            const userPhotoUrl = await getPhotoUrlFromStorage();
            await addDoc(usersCollectionRef, {
                uemail: email,
                upassword: pwd,
                uname: userName,
                uphoto: userPhotoUrl || defaultPhoto,
                isLoggedOut: false,
            })
            await updateProfile(result.user, {
                displayName: userName,
                photoURL: userPhotoUrl || defaultPhoto
            });
            cookies.set('auth-token', result.user.refreshToken);
            setIsLoading(false);
            enqueueSnackbar('Sign up successfully', { variant: 'success' });
            navigate('/login');
        } catch (error) {
            setIsLoading(false);
            console.error(error);
            let errorMessage = email === '' || pwd === '' ? "Email and password cannot be empty" : pwd.length < 6 ? "Password must be at least 6 characters long" : "Please enter a valid email";
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "This email is already in use. Please use a different email.";
            }
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    };

    const getPhotoUrlFromStorage = async () => {
        if (!fileUpload) {
            return;
        }
        const url = await getDownloadURL(filesFolderRef);
        console.log('Get photo URL successfully');
        return url;
    };


    const uploadFile = async () => {
        if (!fileUpload) {
            return;
        }
        try {
            await uploadBytes(filesFolderRef, fileUpload);      // (whr, what)
            console.log("Photo uploaded successfully");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {isLoading ? <Loader /> :
                (
                    <section className='bg-gradient-to-b from-sky-300 to-white h-screen absolute top-0 w-full min-w-[900px]'>
                        <div className='relative mx-auto flex w-[900px] h-[500px] mt-[100px] xl:mt-[250px] rounded'>
                            <div className='bg-white md:w-[50%] w-[60%] p-5'>
                                <div className='h-full'>
                                    <div>
                                        <small>
                                            <span className='mr-3'>Have an account?</span>
                                            <Link to='/login' className='underline text-blue-500 cursor-pointer'>
                                                Log In
                                            </Link>
                                        </small>
                                    </div>
                                    <div className='mt-12 flex justify-center items-center'>
                                        <div className='w-1/2'>
                                            <h1 className='text-5xl font-bold'>Sign Up</h1>
                                        </div>
                                        <div className='w-1/2 cursor-pointer'>
                                            <input
                                            className='mr-[40px] md:mr-0'
                                                type="file"
                                                onChange={(e) => { setFileUpload(e.target.files[0]) }}
                                            />
                                        </div>
                                    </div>
                                    <div className='mt-10 flex xl:flex-row flex-col justify-between xl:space-x-5 '>
                                        <div>
                                            <label className='xl:mr-0 mr-[50px]'>Email</label>
                                            <input
                                                className="p-2 xl:mt-3 mr-[10px] rounded border"
                                                type="email"
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className='xl:mr-0 mr-[20px]'>Password</label>
                                            <input
                                                className="p-2 mt-3 rounded border"
                                                type="password"
                                                onChange={(e) => setPwd(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className='mt-12 ml-6'>
                                        <button
                                            onClick={() => {
                                                signUpWithEP()
                                                setIsLoading(true)
                                            }}
                                            className='bg-[#4F2ED8] w-[350px] p-2 rounded text-white hover:bg-[#3c1eb7]'
                                        >
                                            Sign Up
                                        </button>
                                    </div>
                                    <div className='mt-6 flex items-center justify-center'>
                                        <hr className='w-[150px]' />
                                        <small className='mx-2 text-gray-500'>Or sign in with</small>
                                        <hr className='w-[150px]' />
                                    </div>
                                    <div className='mt-5 ml-20'>
                                        <GoogleButton onClick={signInWithGoogle} />
                                    </div>
                                </div>
                            </div>
                            <div className='w-[50%] hidden md:block'>
                                <img src={signup} alt="Sign Up photo" className='h-full' />
                            </div>
                        </div>
                    </section>
                )}
        </>
    )
}

export default SignUp