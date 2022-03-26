import * as React from 'react'
import {ChakraProvider, theme,} from '@chakra-ui/react'
import {FormulaBox} from './components/FormulaBox/FormulaBox';
import rootReducer from './store/rootReducer';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {Header} from './components/Header/Header';
import {Promo} from './components/Promo/Promo';
import {BottomPromo} from './components/BottomPromo/BottomPromo';
import {Footer} from './components/Footer/Footer';

export const App = () => {
    const store = createStore(rootReducer);
    return (
        <Provider store={store}>
            <ChakraProvider theme={theme}>
                <BrowserRouter>
                    <Header/>
                    <Promo/>
                    <FormulaBox/>
                    <BottomPromo/>
                    <Footer/>
                </BrowserRouter>
            </ChakraProvider>
        </Provider>
    )
}
