import { auth } from "../config/firebase";

const ProfileInfo = () => {
    const dateString = auth?.currentUser?.metadata?.creationTime;
    const userCreated = new Date(dateString);
    const date = userCreated.getDate();
    const month = userCreated.toLocaleString('default', { month: 'short' });
    const year = userCreated.getFullYear();

    return (
        <section className="bg-gray-100 p-4 absolute z-10 right-0 mt-6 mr-8 top-0 w-60 rounded-lg shadow-md border border-gray-300">
            <div className="flex items-center">
                <img
                    src={auth?.currentUser?.photoURL}
                    alt="profile photo"
                    className="w-16 h-16 rounded-full border border-gray-200 mr-2"
                />
                <div>
                    <p className="text-sm font-semibold">Welcome, {auth?.currentUser?.displayName}</p>
                    <p className="text-xs text-gray-500">Member since {date} {month} {year}</p>
                </div>
            </div>
        </section>
    )
}

export default ProfileInfo