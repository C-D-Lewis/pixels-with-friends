import React, { useState, useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import ReactDOM from 'react-dom';
import { Pages, PlayerColors } from './constants';
import { setServerUrl, setRoomName } from './actions';
import store from './store';
import FlexContainer from './components/FlexContainer.jsx';
import Footer from './components/Footer.jsx';
import InGamePage from './pages/InGamePage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LobbyPage from './pages/LobbyPage.jsx';
import EndGamePage from './pages/EndGamePage.jsx';
import Title from './components/Title.jsx';

if (!window.config) alert('There is no config file');

/**
 * Game component.
 *
 * @returns {HTMLElement}
 */
const Game = () => {
  const dispatch = useDispatch();

  const page = useSelector(state => state.page);
  const roomState =useSelector(state => state.roomState);

  let backgroundColor = '#393939';
  if (roomState && page === Pages.InGame) {
    const currentPlayer = roomState.players.find(p => p.playerName === roomState.currentPlayer);
    // They could have left
    if (currentPlayer) {
      const currentPlayerIndex = roomState.players.indexOf(currentPlayer);
      backgroundColor = PlayerColors[currentPlayerIndex].dark;
    }
  }

  // Set server URL from config
  useEffect(() => {
    dispatch(setServerUrl(window.config.serverUrl));
  }, []);

  // Update html, body, #app with same backgroundColor
  useEffect(() => {
    document.getElementById('app').style.backgroundColor = backgroundColor;
    document.body.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);

  return (
    <FlexContainer
      style={{
        width: '100%',
        height: '100%',
        backgroundColor,
        transition: '1s',
      }}>
      <Title>Pixels With Friends</Title>
      {page == Pages.Landing && <LandingPage />}
      {page == Pages.Lobby && <LobbyPage />}
      {page == Pages.InGame && <InGamePage />}
      {page == Pages.EndGame && <EndGamePage />}
      <Footer />
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
