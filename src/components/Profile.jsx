import { useState } from "react";
import { CgProfile } from 'react-icons/cg';
import ProfileInfo from "./ProfileInfo";

const Profile = () => {

    const [isProfileClicked, setIsProfileClicked] =useState(false);

    return (
        <section className="absolute right-10 top-2">
         <CgProfile 
         onClick={() => setIsProfileClicked(!isProfileClicked)}
         className={`${isProfileClicked && 'text-green-500'} absolute right-4 text-3xl top-[-4px] cursor-pointer md:text-slate-300`} />
         {isProfileClicked && <ProfileInfo />}
        </section>
    )
}

export default Profile