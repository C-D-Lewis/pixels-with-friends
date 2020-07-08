import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPage } from '../actions';
import { Pages } from '../constants';
import Button from '../components/Button.jsx';
import Fader from '../components/Fader.jsx';
import FlexContainer from '../components/FlexContainer.jsx';
import Input from '../components/Input.jsx';
import PlayerList from '../components/PlayerList.jsx';
import Text from '../components/Text.jsx';
import apiService from '../services/apiService';

/**
 * LobbyPage component.
 *
 * @returns {HTMLElement}
 */
const LobbyPage = () => {
  const dispatch = useDispatch();

  const roomState = useSelector(state => state.roomState);
  const roomName = useSelector(state => state.roomName);
  const playerName = useSelector(state => state.playerName);

  const isHost = roomState.players[0] && roomState.players[0].playerName === playerName;
  const gameCanStart = roomState.players.length > 1;
  const hostCanStartGame = gameCanStart && isHost;

  useEffect(() => {
    apiService.pollRoomState();

    return () => apiService.stopPolling();
  }, []);

  return (
    <Fader>
      <FlexContainer>
        <Text>{`${roomName} - Lobby`}</Text>
        <PlayerList />
        <Fader when={hostCanStartGame}>
          <Button onClick={() => {}/* Start game */}>Start game</Button>
        </Fader>
      </FlexContainer>
    </Fader>
  );
};

export default LobbyPage;
