import { useState, useEffect } from "react";
import { onSnapshot, query, collection } from "firebase/firestore";
import { db } from "../config/firebase";

const useGetUserInfo = () => {

  const [uInfo, setUInfo] = useState([]);
  const usersCollectionRef = collection(db, "users");

  // get realtime user info 
  useEffect(() => {
    const queryMessages = query(usersCollectionRef);
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let arr = [];
      snapshot.forEach((element) => {
        arr.push({ ...element.data(), id: element.id });
      })
      setUInfo(arr);
    })
    return () => unsubscribe();     // clean up the subscription
  }, []);

  return { uInfo };
}

export default useGetUserInfo


  // onSnapshot 用在useEffect里：
  // 在这种情况下，onSnapshot 的订阅在组件挂载(mounting)时建立，并在组件卸载(unmount)时进行清理(通过useEffect中的return 关键字清理卸载)
  // 这确保了当组件不再渲染或不再存在时，不会继续监听 Firestore 数据的更改。
  // 总的来说：只在必要的时候进行 监听