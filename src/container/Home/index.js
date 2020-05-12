import { useSelector, useDispatch } from "react-redux";   
import './index.scss'



const Home = (props) => {
    const dispatch = useDispatch() 
    const counter = useSelector(state => state.counter) 

    return (
        <div className='home'> 
            <div> {counter.count} </div>
            <div> 
                <button onClick={() => {
                    dispatch({
                        type: 'increase'
                    })
                }}>increase</button>
            </div>
            <div> 
                <button onClick={() => {
                    dispatch({
                        type: 'deincrease'
                    })
                }}>deincrease</button>
            </div>
        </div>
    )
}

export default Home; 