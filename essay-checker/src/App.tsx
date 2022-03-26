import './App.scss';
import {Route, Switch} from 'react-router-dom';
import EtPage from './components/page/Page';
import EtCheck from './components/check/Check';

function App() {
    return (
        // <EtPage/>
    <Switch>
        <Route exact path="/" component={EtPage}/>
        <Route exact path="/:id" component={EtPage}/>
        <Route exact path="/check/:id" component={EtCheck}/>
        {/*<Route exact path="/login" component={Login}/>*/}
        {/*<Route exact path="/register" component={Register}/>*/}
        {/*<Route path="/group/:id" component={Group}/>*/}
        {/*<Route path="/course/:id" component={Course}/>*/}
        {/*<Route path="/" component={Error404}/>*/}
    </Switch>
    );
}

export default App;
