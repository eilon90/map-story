import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'mobx-react'
import {UserStore as userStore} from './stores/UserStore';
import {Page as page} from './stores/Page';
import {Search as search} from './stores/Search';
import {MapStore as mapStore} from './stores/MapStore';
import {NewStoryStore as newStoryStore} from './stores/NewStoryStore';

const UserStore = new userStore();
const Page = new page();
const NewStoryStore = new newStoryStore();
const MapStore = new mapStore(UserStore, NewStoryStore);
const Search = new search();

const stores = {
  UserStore,
  Page,
  MapStore,
  NewStoryStore,
  Search
}

ReactDOM.render(
  <React.StrictMode>
    <Provider {...stores}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
