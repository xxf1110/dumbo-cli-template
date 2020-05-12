import ReactDOM from "react-dom";
import './styles/index.scss'
import './common/global'
import { Provider } from "react-redux";
import store from "./stores/index";
import Routers from "./routers";
import { BrowserRouter, HashRouter } from "react-router-dom";



if (module && module.hot) {
    module.hot.accept()
}

const Router = process.env.NODE_ENV === 'development' ? HashRouter : BrowserRouter;


ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Routers />
        </Router>
    </Provider>,
    document.getElementById('root')
); 