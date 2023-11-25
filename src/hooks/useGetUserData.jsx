import { getDocs, collection } from 'firebase/firestore';
import { db } from "../config/firebase";
import { useEffect, useState } from 'react';


export const useGetUserData = () => {
    const usersCollectionRef = collection(db, 'users');
    const [uData, setUdata] = useState([]);

    // init to get user data
    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = async () => {
        try {
            const data = await getDocs(usersCollectionRef);
            const filteredData = data.docs.map((doc) => (        
                { ...doc.data(), id: doc.id }       //grab directlty the data we want
            ))
            setUdata(filteredData);
        } catch (error) {
            console.error(error);
        }
    };

    return { uData };
}
