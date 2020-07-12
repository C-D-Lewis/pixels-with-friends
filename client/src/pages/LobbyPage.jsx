import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPage, setRoomState } from '../actions';
import { Pages } from '../constants';
import Button from '../components/Button.jsx';
import Fader from '../components/Fader.jsx';
import FlexContainer from '../components/FlexContainer.jsx';
import PlayerList from '../components/PlayerList.jsx';
import Text from '../components/Text.jsx';
import audioService from '../services/audioService';
import apiService from '../services/apiService';

/**
 * LobbyPage component.
 *
 * @returns {HTMLElement}
 */
const LobbyPage = () => {
  const dispatch = useDispatch();

  const roomState = useSelector(state => state.roomState);
  const playerName = useSelector(state => state.playerName);

  const isHost = !!roomState.players.find(p => p.playerName === playerName && p.isHost);
  const playerColors = roomState.players.reduce((acc, p) => [...acc, p.color], []);
  const hostCanStartGame = isHost
    && roomState.players.length > 1
    && !playerColors.every(p => p === playerColors[0]);

  // Check room state while waiting.
  useEffect(() => {
    apiService.pollRoomState();
    return () => apiService.stopPollRoomState();
  }, []);

  // When room state updates, game could have begun
  useEffect(() => {
    if (!roomState) return;

    // Host left?
    if (!roomState.players.find(p => p.isHost)) {
      alert('Host left the game');
      dispatch(setPage(Pages.Landing));
      return;
    }

    // Game has begun
    if (roomState.inGame) {
      audioService.play('ingame.mp3');
      dispatch(setPage(Pages.InGame));
    }
  }, [roomState]);

  /**
   * Host starts the game.
   */
  const startGame = async () => {
    if (!isHost) return;

    try {
      // Go to game!
      dispatch(setRoomState(await apiService.putRoomInGame()));
      dispatch(setPage(Pages.InGame));
    } catch (e) {
      console.log(e);
      alert(e);
    }
  };

  // TODO: How to Play

  return (
    <Fader>
      <FlexContainer>
        <Text>{`You are in "${roomState.roomName}"`}</Text>
        <PlayerList />
        {hostCanStartGame == false ? (
          <Text
            style={{
              margin: 15,
              textAlign: 'center',
              maxWidth: 600,
            }}>
            The host can start the game after two or more players have joined, and more than one team color is selected.
          </Text>
        ) : (
          <Button onClick={startGame}>Start game</Button>
        )}
      </FlexContainer>
    </Fader>
  );
};

export default LobbyPage;
