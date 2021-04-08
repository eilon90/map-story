import {inject, observer} from 'mobx-react';
import {Route} from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Navbar from './Navbar';

import { AppBar, Tab, Tabs } from "@material-ui/core";import StoriesContainer from './StoriesContainer';

const SideArea = inject('UserStore')(observer((props) => {
    const useStyles = makeStyles(() => ({
        sideArea: {
            
        }
    }))
    const classes = useStyles();

    return (
        <div className = {classes.container}>
            <Navbar/>
            <StoriesContainer/>
        </div>
    )
}))

export default SideArea;