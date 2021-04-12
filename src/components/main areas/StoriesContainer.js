import { Route, Redirect } from "react-router-dom";
import {inject, observer} from 'mobx-react';
import { makeStyles } from '@material-ui/core';
import StoryScreen from '../side area story/StoryPage';
import StoryFullScreen from '../full screen story/StoryFullScreen';
import UserPage from '../userPage/UserPage';
import NewStory from '../newStory/NewStory';
import EventsList from '../newStory/EventsList';
import SearchUser from '../users/SearchUser';
import Login from '../login/Login';
import Register from '../login/Register';
import { useEffect } from 'react';
const axios = require('axios');

const StoriesContainer = inject('MapStore', 'UserStore', 'Page', 'NewStoryStore')(observer((props) => {
    const {MapStore, UserStore, Page, NewStoryStore} = props;
    const useStyles = makeStyles(() => ({
        container: {
            height: '95vh'
        }
    }))
    const classes = useStyles();

    // useEffect(() => {
    //     if (stories) {
    //         MapStore.getEventsMarkers(events);
    //     };
    // }, [UserStore.user])

    const stories = UserStore.user ? UserStore.user.stories : null;
    const currentStory = stories ? stories.find(s => s._id === UserStore.currentStoryId) : null
    const events = currentStory ? currentStory.events : null;

    // const uploadPhoto = async e => {
    //     const file = e.target.files[0];
    //     const newFormData = new FormData();
    //     newFormData.append('file', file);
    //     newFormData.append('upload_preset', 'eilon90_map_story');
    //     const result = await axios.post('https://api.cloudinary.com/v1_1/eilon90/image/upload', newFormData);
    //     console.log(result.data);
    // }

    return (
        <div className = {classes.container}>
            <Route exact path="/"><Redirect to={localStorage.userId ? `/userPage/${localStorage.userId}` : '/userPage/607321afe1775a0c7c5af5f8'} /></Route>
            <Route exact path="/login" render={() => <Login/>}/>
            <Route exact path="/register" render={() => <Register/>}/>
            <Route exact path="/userPage/:userId" render={() => <UserPage />}/>
            <Route exact path="/searchUser" render={() => <SearchUser />}/>
            <Route exact path="/storyPage/:userId/:storyId" render={() => <StoryScreen/>}/>
            <Route exact path="/newStory" render={() => <NewStory/>}/>
            <Route exact path="/eventsList" render={() => NewStoryStore.storyTitle ? <EventsList/> : <NewStory/>}/>
            {/* <input type = 'file' onChange = {uploadPhoto}/> */}
        </div>
    )
}))

export default StoriesContainer;

