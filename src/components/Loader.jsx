import ClipLoader from "react-spinners/ClipLoader";

const Loader = () => {
    return (
        <div className='fixed inset-0 flex items-center justify-center'>
            <ClipLoader 
                color="#36d7b7" 
                size={70}
            />
        </div>
    )
}

export default Loader
