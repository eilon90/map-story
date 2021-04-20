import {inject, observer} from 'mobx-react';
import { Button, makeStyles, TextField, Typography, FormControl, Select, InputLabel, MenuItem, RadioGroup, FormControlLabel, Radio, FormLabel } from '@material-ui/core';
import { Link } from 'react-router-dom';

const NewStory = inject('NewStoryStore', 'MapStore')(observer((props) => {
    const {NewStoryStore, MapStore} = props;
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
            <FormControl className = {classes.form} component="fieldset">
                <FormLabel component="legend">Who can watch the story?</FormLabel>

                <RadioGroup aria-label="private" name="private" className = {classes.select} value = {NewStoryStore.privateStory ? true : false} onChange={changePrivacy}>
                    <FormControlLabel value = {false} control={<Radio />} label="Every user" />
                    <FormControlLabel value = {true} control={<Radio />} label="Only me" />
                </RadioGroup>
            </FormControl>

            <Button className = {classes.button} color = 'primary' variant="contained" disabled = {NewStoryStore.storyTitle ? false : true} onClick = {makeMapActive} component={Link} to = '/eventsList'>{NewStoryStore.newStory ? 'Add events to the story' : 'Move to events'}</Button>
            <Button className = {classes.button} variant="contained" onClick = {deleteTitleAndDesc} component={Link}  to={'/'}>Cancel</Button>
        </div>
    )
}))

export default NewStory;