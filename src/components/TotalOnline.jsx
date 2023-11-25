import { BsFillPeopleFill } from 'react-icons/bs';
import useGetOnlineNums from '../hooks/useGetOnlineNums';


const TotalOnline = () => {
    const { onlinePeopleNums } = useGetOnlineNums();

    return (
        <section>
            <div className="flex absolute top-[3%] right-0 m-5">
                <BsFillPeopleFill className="text-3xl text-green-400" />
                <span className="text-sm text-green-400">{onlinePeopleNums}</span>
            </div>
        </section>
    )
}

export default TotalOnline