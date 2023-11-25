import { IoLogOut } from "react-icons/io5";
import { signOut } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { useLoggingStore } from "../store";

const LogOut = ({ uInfo }) => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const cookies = new Cookies();
    // const setLoggedState = useLoggingStore((store) => store.setLoggingOut)          // way 1 to write 
    const { setLoggingOut: setLoggedState } = useLoggingStore();        // way 2 to write

    // log out
    const logOut = async () => {
        setLoggedState(true);
        try {
            await updateLoggedOutState();
            await signOut(auth);
            cookies.remove("auth-token");
            setLoggedState(false);
            enqueueSnackbar("Log Out successfully", { variant: 'success' });
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    // updateLoggedOutState
    const updateLoggedOutState = async () => {
        try {
            const currentUserDisplayName = auth.currentUser?.displayName;

            if (!currentUserDisplayName) {
                console.error("Current user display name is undefined");
                return;
            }

            for (const user of uInfo) {
                if (user.uname === currentUserDisplayName) {
                    await updateDoc(doc(db, 'users', user.id), {
                        isLoggedOut: true
                    });
                }
            }
            console.log("Updated isLoggedOut successfully");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section>
            <IoLogOut
                className="text-4xl cursor-pointer absolute right-0 top-0 md:text-slate-300"
                onClick={logOut}
            />
        </section>
    )
}

export default LogOut