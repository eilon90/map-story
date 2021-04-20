import {inject, observer} from 'mobx-react';
import { makeStyles } from '@material-ui/core';
import { AppBar, Tab, Tabs, IconButton } from "@material-ui/core";
import { Link, useHistory } from 'react-router-dom';
import { ExitToApp, Home } from '@material-ui/icons';

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
            {!UserStore.userId && <IconButton onClick = {removeMarkers} component={Link} to="/userPage/607321afe1775a0c7c5af5f8"><Home /></IconButton>}
                <Tab className = {classes.tab} label = {UserStore.userId ? 'Your stories' : 'Log in'} onClick = {removeMarkers} component={Link}  to = {UserStore.userId ? `/userPage/${UserStore.userId}` : '/login'}/>
                <Tab className = {classes.tab} label = 'Watch stories' onClick = {removeMarkers} component={Link}  to="/searchUser"/>
            </Tabs>
            {UserStore.userId && <IconButton onClick={signOut}><ExitToApp /></IconButton>}
        </AppBar>
    )
}))

export default Navbar;