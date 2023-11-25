import { db } from "../config/firebase";
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";



const useGetMessages = () => {
    const messagesCollectionRef = collection(db, "messages");
    const chatRoom = "general";
    const [messages, setMessages] = useState([]);

    // get realtime messages data
    useEffect(() => {
        const queryMessages = query(messagesCollectionRef, where("chatRoom", "==", chatRoom), orderBy("createdAt"));
        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {            // onSnapshot listen to the collection changes, then callback function will be called every time there is a change in the data
            let messages = [];
            snapshot.forEach((doc) => {
                messages.push({ ...doc.data(), id: doc.id });
            });
            setMessages(messages);
        })
        return () => unsubscribe();     //To stop listening to the collection changes, call the unsubscribe function.
    }, []);

    return { messages };
}

export default useGetMessages