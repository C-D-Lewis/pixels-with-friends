import React, { useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import ReactDOM from 'react-dom';
import { Pages, PlayerColors } from './constants';
import { setServerUrl } from './actions';
import store from './store';
import FlexContainer from './components/FlexContainer.jsx';
import Footer from './components/Footer.jsx';
import Title from './components/Title.jsx';
import EndGamePage from './pages/EndGamePage.jsx';
import InGamePage from './pages/InGamePage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LobbyPage from './pages/LobbyPage.jsx';

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

  let backgroundColor = '#666';
  if (roomState && page === Pages.InGame) {
    const currentPlayer = roomState.players.find(p => p.playerName === roomState.currentPlayer);
    if (currentPlayer) {
      backgroundColor = PlayerColors.find(p => p.name === currentPlayer.color).dark;
    }
  }

  // Set server URL from config
  useEffect(() => {
    dispatch(setServerUrl(window.config.serverUrl));
  }, []);

  // Update html, body, #app with same backgroundColor to avoid bottom gap
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
      <FlexContainer style={{
        flexDirection: 'row',
        alignItems: 'center',
        margin: '15px 0px',
      }}>
        <img
          src="assets/images/logo.png"
          style={{
            width: 48,
            height: 48,
            marginRight: 20,
          }}/>
        <Title>Pixels With Friends</Title>
      </FlexContainer>
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
