import { auth, db } from "../config/firebase";
import Search from "../components/Search";
import Profile from "../components/Profile";
import LogOut from "../components/LogOut";
import { useState, useEffect, useRef } from "react";
import { FaEdit } from 'react-icons/fa'
import { BsFillTrashFill } from 'react-icons/bs';
import { MdMoreHoriz } from 'react-icons/md';
import { addDoc, collection, serverTimestamp, updateDoc, doc, deleteDoc } from "firebase/firestore";
import TotalOnline from "../components/TotalOnline";
import Loader from '../components/Loader';
import useGetMessages from "../hooks/useGetMessages";
import useGetUserInfo from "../hooks/useGetUserInfo";
import { useLoggingStore } from "../store";

const Chat = () => {
    const chatRoom = "general";
    const [newMessage, setNewMessage] = useState('');
    const messagesCollectionRef = collection(db, "messages");
    const [updatedMessage, setUpdatedMessage] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);
    const [isWantDlt, setIsWantDlt] = useState(false);
    const [isMore, setIsMore] = useState(false);
    const divUnderMessages = useRef(null);
    const [isEditOrDlt, setIsEditOrDlt] = useState(false);
    const { messages } = useGetMessages();
    const { uInfo } = useGetUserInfo();
    const { loggingOut: loggingOut } = useLoggingStore();

    // init scroll down
    useEffect(() => {
        const time = setTimeout(() => {
            divUnderMessages.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 2000);

        return () => clearTimeout(time);
    }, []);

    // only sending message will scroll down
    useEffect(() => {
        if (isEditOrDlt) {
            return;
        } else {
            divUnderMessages.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isEditOrDlt]);

    // when submit push to database (messages colleciton)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage === '') return;
        setIsEditOrDlt(false);
        await addDoc(messagesCollectionRef, {
            text: newMessage,
            createdAt: serverTimestamp(),    // this function will set the time to when it was created
            user: auth.currentUser?.displayName,
            photo: auth?.currentUser?.photoURL,
            wantEdit: false,
            edited: false,
            wantDlt: false,
            deleted: false,
            chatRoom,
        });
        setNewMessage('');
    };


    // update messages
    const updateMessages = async (id) => {
        const messagesCollecitonRef = doc(db, "messages", id);
        if (updatedMessage === '') {
            await updateDoc(messagesCollecitonRef, {
                wantEdit: false,
            });
            return;
        };
        try {
            await updateDoc(messagesCollecitonRef, {
                text: updatedMessage,
                edited: true,
                wantEdit: false,
            });
            setUpdatedMessage('');
            console.log("Updated successfully");
        } catch (error) {
            console.error(error);
        }
    };

    // for edit icon
    const updateWantedEdit = async (id) => {
        try {
            setIsEditOrDlt(true);
            const messagesCollecitonRef = doc(db, "messages", id);
            await updateDoc(messagesCollecitonRef, {
                wantEdit: true,
            });
            console.log('Update wantedEdit successfully');
        } catch (error) {
            console.error(error);
        }
    }

    const updateDltMsg = async (id) => {
        try {
            const dltMessageRef = doc(db, "messages", id);
            await updateDoc(dltMessageRef, {
                wantDlt: isWantDlt
            })
        } catch (error) {
            console.error(error);
        }
    };

    // delete messages
    const deleteMessages = async (id) => {
        try {
            setIsEditOrDlt(true);
            const dltMessageRef = doc(db, "messages", id);
            await deleteDoc(dltMessageRef);
            console.log("Deleted successfully");
            setIsWantDlt(false);
        } catch (error) {
            console.error(error);
        }
    };

    // console.log(auth.currentUser);
    return (
        <section className="bg-slate-800">
            {loggingOut ? <Loader /> : (
                <>
                    <div className="h-screen left-[25%] absolute w-3/4">
                        <div className="h-[10%] flex items-center">
                            <div className="ml-[5%]">
                                <h1 className="lg:text-6xl md:text-4xl text-lg md:text-slate-300">Welcome {auth.currentUser?.displayName}</h1>
                            </div>
                        </div>
                        <div className="h-[90%] relative">
                            <div className="bg-slate-600 overflow-y-scroll h-[90%]">
                                {messages.map((message) => (
                                    <div key={message.id}>
                                        {message.user === auth.currentUser?.displayName ? (
                                            <div className="p-2 relative rounded mb-2 mr-4 h-full text-right">
                                                <div className="absolute right-4 top-4">
                                                    <img
                                                        src={auth.currentUser.photoURL}
                                                        alt="profile photo"
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                </div>
                                                <div className="mr-12">
                                                    <small className="text-white">{message.user}</small>
                                                    {message.edited ? (
                                                        <div>
                                                            <p className='bg-blue-500 max-w-[500px] text-slate-200 p-2 rounded inline-block'>
                                                                {message.text} <small className="text-[8px]">(edited)</small>
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <p className='bg-blue-500 max-w-[500px] text-slate-200 p-2 rounded inline-block'>
                                                                {message.text}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <MdMoreHoriz
                                                        className='absolute right-0 mr-5 top-12 cursor-pointer text-2xl text-white'
                                                        onClick={() => setIsMore(!isMore)}
                                                    />
                                                    {isMore && (
                                                        <div>
                                                            {message.wantEdit ? (
                                                                <div>
                                                                    <input
                                                                        placeholder="Edit message..."
                                                                        onChange={(e) => setUpdatedMessage(e.target.value)}
                                                                        type="text" />
                                                                    <button
                                                                        className='text-red-300'
                                                                        onClick={() => {
                                                                            updateMessages(message.id)
                                                                            setIsUpdate(false);
                                                                        }}>Edit!</button>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <FaEdit
                                                                        onClick={() => {
                                                                            setIsUpdate(!isUpdate)
                                                                            updateWantedEdit(message.id)
                                                                        }}
                                                                        className='absolute right-0 top-[-10px] mt-14 cursor-pointer text-slate-200'
                                                                    />
                                                                </div>
                                                            )}
                                                            <BsFillTrashFill
                                                                onClick={() => {
                                                                    setIsWantDlt(!isWantDlt)
                                                                    updateDltMsg(message.id)
                                                                }}
                                                                className='absolute right-0 top-3 mt-14 cursor-pointer text-slate-200'
                                                            />
                                                            {message.wantDlt && (
                                                                <div className="bg-slate-400 mx-auto w-[400px] py-6 text-center rounded borded">
                                                                    <h1 className="text-red-800 text-xl font-bold">Confirm Delete Message</h1>
                                                                    <p className="text-red-800">Are you sure you want to delete this message?</p>
                                                                    <div className="flex justify-center">
                                                                        <button
                                                                            onClick={() => {
                                                                                setIsWantDlt(false)
                                                                                updateDltMsg(message.id)
                                                                            }}
                                                                            className="bg-red-500 hover:bg-red-600 text-white font-bold mr-5 py-2 px-4 rounded mt-2">
                                                                            Cancel
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                deleteMessages(message.id)
                                                                            }}
                                                                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-2">
                                                                            Confirm
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-2 relative rounded mb-2 text-left">
                                                <div className="absolute top-4">
                                                    <img
                                                        src={message.photo}
                                                        alt="profile photo"
                                                        className="w-8 h-8 rounded-full object-cover mr-2"
                                                    />
                                                </div>
                                                <div className="ml-10 inline-block">
                                                    <small className="text-white">{message.user}</small>
                                                    {message.edited ? (
                                                        <p className='bg-slate-200 text-black max-w-[500px] p-2 rounded'>
                                                            {message.text} <small className="text-[8px]">(edited)</small>
                                                        </p>
                                                    ) : (
                                                        <p className='bg-slate-200 text-black max-w-[500px] p-2 rounded'>
                                                            {message.text}
                                                        </p>
                                                    )}

                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div ref={divUnderMessages}></div>
                            </div>
                            <div className="bg-slate-500 h-[10%] flex items-center relative">
                                <div className="md:pl-5 w-full absolute xl:top-5 md:top-0">
                                    <form onSubmit={handleSubmit}>
                                        <input
                                            type="text"
                                            placeholder="Type your message here..."
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            value={newMessage}
                                            className="mr-10 w-full md:w-2/3 p-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                        />
                                        <button
                                            type="submit"
                                            className='bg-indigo-600 hover:bg-indigo-700 p-3 md:p-4 w-full md:w-1/4 text-white rounded focus:outline-none'
                                        >
                                            Send
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Search uInfo={uInfo} />
                    <TotalOnline />
                    <Profile />
                    <LogOut uInfo={uInfo}/>
                </>
            )}
        </section>
    )
}

export default Chat