import React, { useState, useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import ReactDOM from 'react-dom';
import { Pages } from './constants';
import { setServerUrl, setRoomName } from './actions';
import store from './store';
import LandingPage from './pages/LandingPage.jsx';
import LobbyPage from './pages/LobbyPage.jsx';
import InGamePage from './pages/InGamePage.jsx';
import FlexContainer from './components/FlexContainer.jsx';
import Title from './components/Title.jsx';

/**
 * Game component.
 *
 * @returns {HTMLElement}
 */
const Game = () => {
  const page = useSelector(state => state.page);

  return (
    <FlexContainer
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#393939',
      }}>
      <Title>Pixels With Friends</Title>
      {page == Pages.Landing && <LandingPage />}
      {page == Pages.Lobby && <LobbyPage />}
      {page == Pages.InGame && <InGamePage />}
    </FlexContainer>
  );
};

/**
 * Application components.
 *
 * @returns {HTMLElement}
 */
const Application = () => (
  <Provider store={store}>
    <Game/>
  </Provider>
);

ReactDOM.render(<Application />, document.getElementById('app'));
