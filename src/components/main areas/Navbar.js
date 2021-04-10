import {inject, observer} from 'mobx-react';
import { makeStyles } from '@material-ui/core';
import { AppBar, Tab, Tabs, IconButton } from "@material-ui/core";
import { Link, useHistory } from 'react-router-dom';
import { ExitToApp } from '@material-ui/icons';
// import UserPage from '../userPage/UserPage';
// import SearchUser from '../users/SearchUser';

const Navbar = inject('UserStore', 'Page', 'MapStore')(observer((props) => {
    const {UserStore, Page, MapStore} = props;
    const useStyles = makeStyles(() => ({
        navbar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
        },
        tab: {
            fontFamily: "'Kavivanar', cursive"
        }
    }))
    const classes = useStyles();
    const history = useHistory();

    function a11yProps(index) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        }
      }

    const signOut = () => {
        MapStore.removeAllMarkers();
        localStorage.clear();
        UserStore.signOut();
        history.push('/')
    }

      const changeTab = (e, value) => Page.changeTab(value);
      const removeMarkers = () => MapStore.removeAllMarkers();

    return (
        <AppBar className = {classes.navbar} position = 'static'>
            <Tabs value = {Page.currentTab} onChange = {changeTab}> 
                <Tab className = {classes.tab} label = {UserStore.userId ? 'Your stories' : 'Log in'} onClick = {removeMarkers} component={Link}  to="/" {...a11yProps(0)}/>
                <Tab className = {classes.tab} label = 'Watch stories' onClick = {removeMarkers} component={Link}  to="/searchUser" {...a11yProps(1)}/>
            </Tabs>
            {UserStore.userId && <IconButton onClick={signOut}><ExitToApp /></IconButton>}
        </AppBar>
    )
}))

export default Navbar;