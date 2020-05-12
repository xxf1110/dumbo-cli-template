import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducers from './reducers/index'
// import {createLogger} from 'redux-logger'

const middleWares = [thunk]

// if (process.env.NODE_ENV === 'development') {
//     const logger = createLogger({ collapsed: true })
//     middleWares.push(logger)
// }

const store = compose(applyMiddleware(...middleWares))(createStore)(rootReducers)
export default store