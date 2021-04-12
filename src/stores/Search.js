import {observable, action, computed, makeObservable} from 'mobx';
const axios = require('axios');

export class Search {
    constructor() {
        this.searchStirng = '';
        this.users = [];
        this.stories = [];

        makeObservable(this, {
            searchStirng: observable,
            users: observable,
            stories: observable,
            typeSearch: action,
            searchUser: action,
            searchStory: action,
            resetValues: action
        })
    }

    typeSearch = value => this.searchStirng = value;

    async searchUser() {
        this.users = [];
        this.stories = [];
        const results = await axios.get(`/search/users?q=${this.searchStirng}`);
        results.data.forEach(d => this.users.push(d));
        this.searchStirng = '';
    }

    async searchStory() {
        this.users = [];
        this.stories = [];
        const results = await axios.get(`/search/stories?q=${this.searchStirng}`);
        results.data.forEach(d => this.stories.push(d));
        this.searchStirng = '';
    }

    resetValues() {
        this.searchStirng = '';
        this.users = [];
        this.stories = [];
    }
}