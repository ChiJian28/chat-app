import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { onSnapshot, query, collection, where } from "firebase/firestore";



const useGetOnlineNums = () => {
    const [onlinePeopleNums, setOnlinePeopleNums] = useState(0);
    const userRef = collection(db, "users");    

    useEffect(() => {
        const queryUser = query(userRef, where("isLoggedOut", "==", false));
        const unsubscribe = onSnapshot(queryUser, (snapshot) => {
            const peopleOnline = snapshot.size
            setOnlinePeopleNums(peopleOnline);
        });
        return () => unsubscribe(); // 停止监听
    }, []);

  return  { onlinePeopleNums };
}

export default useGetOnlineNums