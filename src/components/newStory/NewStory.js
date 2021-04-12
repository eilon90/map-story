import {inject, observer} from 'mobx-react';
import { Button, makeStyles, TextField, Typography, FormControl, Select, InputLabel, MenuItem } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

const NewStory = inject('UserStore', 'Page', 'NewStoryStore', 'MapStore')(observer((props) => {
    const {UserStore, Page, NewStoryStore, MapStore} = props;
    const useStyles = makeStyles(() => ({
        newStory: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        },
        pageTitle: {
            textAlign : 'center',
            margin: '5%',
            fontWeight: 'bold'
        },
        textField: {
            width: '80%',
            margin: '4%'
        },
        button: {
            width: '70%',
            marginBottom: '3%'
        },
        form: {
            width: '80%',
            marginBottom: '4%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start'
        },
        select: {
            width: '100%',
            marginBottom: '4%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start'
        }
    }))
    const classes = useStyles();

    const typeTitle = e => NewStoryStore.typeStoryTitle(e.target.value);
    const typeDesc = e => NewStoryStore.typeStoryDesc(e.target.value);
    const makeMapActive = () => NewStoryStore.makeMapActive();
    const changePrivacy = e => NewStoryStore.changePrivacy(e.target.value);
    const deleteTitleAndDesc = () => {
        NewStoryStore.deleteStory();
        MapStore.backToGlobalZoom();
    }

    return (
        <div className = {classes.newStory}>
            <Typography className = {classes.pageTitle} variant = 'h4'>{NewStoryStore.newStory ? 'Create a New Story' : 'Edit the Story'}</Typography>
            <TextField className = {classes.textField}  label = 'Title' value = {NewStoryStore.storyTitle} onChange = {typeTitle}/>
            <TextField className = {classes.textField} label = 'Description' multiline rows={4} variant="outlined" value = {NewStoryStore.storyDescription} onChange = {typeDesc}/>
            <FormControl variant="outlined" className = {classes.form} size = "small">
                <Typography variant = 'subtitle2'>Who can watch the story?</Typography>
                <Select className = {classes.select} labelId="select" value = {NewStoryStore.privatStory} onChange={changePrivacy}>
                    <MenuItem value = {false}>Every user</MenuItem>
                    <MenuItem value = {true}>Only me</MenuItem>
                </Select>
            </FormControl>
            <Button className = {classes.button} color = 'primary' variant="contained" disabled = {NewStoryStore.storyTitle ? false : true} onClick = {makeMapActive} component={Link} to = '/eventsList'>{NewStoryStore.newStory ? 'Add events to the story' : 'Move to events'}</Button>
            <Button className = {classes.button} variant="contained" onClick = {deleteTitleAndDesc} component={Link}  to={'/'}>Cancel</Button>
        </div>
    )
}))

export default NewStory;