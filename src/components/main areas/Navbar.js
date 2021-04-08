import {inject, observer} from 'mobx-react';
import { makeStyles } from '@material-ui/core';
import { AppBar, Tab, Tabs } from "@material-ui/core";
import { Link, useHistory } from 'react-router-dom';
// import UserPage from '../userPage/UserPage';
// import SearchUser from '../users/SearchUser';

const Navbar = inject('UserStore', 'Page', 'MapStore')(observer((props) => {
    const {UserStore, Page, MapStore} = props;
    const useStyles = makeStyles(() => ({
        navbar: {
        
        },
        tab: {
            fontFamily: "'Kavivanar', cursive"
        }
    }))
    const classes = useStyles();

    function a11yProps(index) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        }
      }

      const changeTab = (e, value) => Page.changeTab(value);
      const removeMarkers = () => MapStore.removeAllMarkers();

    return (
        <AppBar className = {classes.navbar} position = 'static'>
            <Tabs value = {Page.currentTab} onChange = {changeTab}> 
                <Tab className = {classes.tab} label = 'Your stories' onClick = {removeMarkers} component={Link}  to="/" {...a11yProps(0)}/>
                <Tab className = {classes.tab} label = 'Watch stories' component={Link}  to="/searchUser" {...a11yProps(1)}/>
            </Tabs>
        </AppBar>
    )
}))

export default Navbar;