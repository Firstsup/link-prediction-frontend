import {Component} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import System from './graph/System';
import './App.less'

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path={'/'} element={<System/>}/>
                </Routes>
            </BrowserRouter>
        )
    }
}

export default App;