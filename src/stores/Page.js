import {observable, action, computed, makeObservable} from 'mobx';

export class Page {
    constructor() {
        this.currentTab = 0;
        this.photoTextToggle = 0;
        this.fullScreenVisible = false;
        this.generalPopupVisible = false;
        this.addPhotoVisible = false;
        this.popupAction = '';

        makeObservable(this, {
            currentTab: observable,
            fullScreenVisible: observable,
            photoTextToggle: observable,
            addPhotoVisible: observable,
            generalPopupVisible: observable,
            changeTab: action,
            openFullScreen: action,
            closeFullScreen: action,
            photoTextChange: action,
            openGeneralPopup: action,
            closeGeneralPopup: action,
            openPhotoPopup: action,
            closePhotoPopup: action
        })
    }

    changeTab = val => this.currentTab = val;
    
    openFullScreen = () => this.fullScreenVisible = true;

    closeFullScreen() {
        this.fullScreenVisible = false;
        this.photoTextToggle = 0;
    } 

    photoTextChange = () => this.photoTextToggle === 0 ? this.photoTextToggle++ : this.photoTextToggle--;

    openGeneralPopup(action) {
        this.popupAction = action;
        this.generalPopupVisible = true;
    }
    closeGeneralPopup = () => this.generalPopupVisible = false;

    openPhotoPopup = () => this.addPhotoVisible = true;
    closePhotoPopup = () => this.addPhotoVisible = false;
}