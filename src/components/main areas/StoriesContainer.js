import { Route, Redirect } from "react-router-dom";
import {inject, observer} from 'mobx-react';
import { makeStyles } from '@material-ui/core';
import StoryScreen from '../side area story/StoryPage';
import UserPage from '../userPage/UserPage';
import NewStory from '../newStory/NewStory';
import EventsList from '../newStory/EventsList';
import SearchUser from '../users/SearchUser';
import Login from '../login/Login';
import Register from '../login/Register';

const StoriesContainer = inject('UserStore', 'NewStoryStore')(observer((props) => {
    const {UserStore, NewStoryStore} = props;
    const useStyles = makeStyles(() => ({
        container: {
            height: '95vh'
        }
    }))
    const classes = useStyles();

    const stories = UserStore.user ? UserStore.user.stories : null;
    const currentStory = stories ? stories.find(s => s._id === UserStore.currentStoryId) : null
    const events = currentStory ? currentStory.events : null;

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
        </div>
    )
}))

export default StoriesContainer;

