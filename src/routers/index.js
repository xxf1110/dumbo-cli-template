import { Route, Switch } from "react-router-dom";
import asyncComponent from "@/components/asyncComponent"; 

const Home = asyncComponent(() => import('@/container/Home'))
const NoMatch = asyncComponent(() => import('@/container/NoMatch'))



const routers = () => (
    <Switch>
        <Route exact path="/" component={Home} /> 

        <Route exact component={NoMatch} />
    </Switch>
)

export default routers