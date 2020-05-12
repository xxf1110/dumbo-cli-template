import { handleActions } from 'redux-actions';

let initialState = {
    count: 0
}
const Counter = handleActions({
    increase: (state, action) => ({
        ...state,
        count: state.count + 1
    }),
    deincrease: (state, action) => ({
        ...state,
        count: state.count - 1
    }),
}, initialState);


export default Counter;