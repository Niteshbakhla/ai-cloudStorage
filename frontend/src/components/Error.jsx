import { AlertCircle } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setError } from '../redux/slices/fetchSlice';


const Error = () => {
            const dispatch = useDispatch();
            const { error } = useSelector(state => state.fetch);
            console.log(error)
            return (
                        <>
                                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                                                <div className="flex">
                                                            <AlertCircle className="text-red-400 mr-3" size={20} />
                                                            <div>
                                                                        <p className="text-red-700">{error}</p>
                                                                        <button
                                                                                    onClick={() => dispatch(setError(null))}
                                                                                    className="text-red-600 hover:text-red-800 text-sm underline mt-1 cursor-pointer"
                                                                        >
                                                                                    Dismiss
                                                                        </button>
                                                            </div>
                                                </div>
                                    </div>
                        </>
            )
}

export default Error