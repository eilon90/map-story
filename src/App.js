import './App.css';
import { inject, observer } from 'mobx-react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import SideArea from './components/main areas/SideArea';
import Map from './components/map/Map';
import { useEffect } from 'react';
import GeneralPopup from './components/popups/GeneralPopup';
import AddPhoto from './components/popups/AddPhoto';

const App = inject('UserStore')(observer((props) => {
    const {UserStore} = props;

    const theme = createMuiTheme({
        palette: {
          primary: {
            main: '#006D77'
          },
          secondary: {
            main: "#52b788"
          }
        }
      })

    const useStyles = makeStyles(() => ({
        app: {
            display: 'grid',
            gridTemplateColumns: '3fr 9fr',
            height: '100vh'
        }
    }))
    const classes = useStyles();

    useEffect(() => {
        if (localStorage.userId) {
            UserStore.setUserId(localStorage.userId);
            UserStore.fetchUser();
          }
    }, [])

    return (
        <Router>
            <ThemeProvider theme = {theme}>
                <div className = {classes.app}>
                    <SideArea/>
                    <Map/>
                </div>
            </ThemeProvider>
            <GeneralPopup/>
            <AddPhoto/>
        </Router>
    )
}))

export default App;
