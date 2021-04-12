import {inject, observer} from 'mobx-react';
import { makeStyles, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

const GeneralPopup = inject('UserStore', 'Page', 'NewStoryStore', 'MapStore')(observer((props) => {
    const {UserStore, Page, NewStoryStore, MapStore} = props;
    const useStyles = makeStyles(() => ({
        generalPopup: {

        }
    }))
    const classes = useStyles();
    const history = useHistory();

    let text ;
    let func;

    switch (Page.popupAction) {
        case 'deleteStory': {
            text = 'Are you sure you want to delete the story?';
            func = async () => {
                MapStore.removeMarkers(NewStoryStore.eventsList);
                await NewStoryStore.deleteStory(UserStore.userId);
                await UserStore.fetchUser();
                MapStore.backToGlobalZoom();
                history.push('/');
            }
        }
        break;
    }
    
    const openGeneralPopup = () => Page.openGeneralPopup();
    const cancel = () => Page.closeGeneralPopup();
    const confirm = () => {
        func();
        Page.closeGeneralPopup();
    }

    return (
        <Dialog open = {Page.generalPopupVisible}>
            <DialogTitle id="alert-dialog-title">{text}</DialogTitle>
            {/* <DialogContent>
                <DialogContentText>{text}</DialogContentText>
            </DialogContent> */}
            <DialogActions>
                <Button onClick={cancel} color="primary">Cancel</Button>
                <Button onClick={confirm} color="primary" autoFocus>Continue</Button>
            </DialogActions>
      </Dialog>
    )
}))

export default GeneralPopup;