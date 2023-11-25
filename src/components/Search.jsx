import { IoSearchOutline } from "react-icons/io5";
import { useState } from "react";
import { GoDotFill } from "react-icons/go";

const Search = ({ uInfo }) => {
    const [search, setSearch] = useState('');

    return (
        <section className="bg-black hidden p-4 w-1/4 h-screen md:flex flex-col">
            <div className=" h-full relative overflow-y-scroll bg-slate-700">
                <IoSearchOutline
                    className="text-4xl absolute right-[8%] top-1 cursor-pointer"
                />
                <input
                    className="w-[90%] mx-auto flex p-3"
                    type="text"
                    placeholder="Search..."
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="flex flex-col space-y-10">
                    {/* 先filter 再map，filter会把返回true的元素 作为新数组，两者都是迭代方法 */}
                    {uInfo
                        .filter((e) => {
                            return search.toLowerCase() === '' ? e : e.uname.toLowerCase().includes(search)
                        })
                        .map((e) => (
                            <div key={e.id} className="flex items-center w-[90%] relative ml-5 mt-5 space-x-3">
                                <div className="h-[50px] mr-3 w-[50px] border-2 rounded-full shadow-md overflow-hidden">
                                    <img src={e.uphoto} alt="Profile photo" className="h-full m-auto" />
                                </div>
                                <h2 className={`${e.isLoggedOut ? 'text-slate-400' : 'text-white'} mr-[100px]`}>{e.uname}</h2>
                                <GoDotFill className={`${e.isLoggedOut ? 'text-slate-400' : 'text-green-500'} absolute right-[1%]`} />
                            </div>
                        ))}
                </div>
            </div>
        </section>
    )
}

export default Search