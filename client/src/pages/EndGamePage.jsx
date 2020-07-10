import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPage, setRoomState } from '../actions';
import { Pages } from '../constants';
import Button from '../components/Button.jsx';
import Fader from '../components/Fader.jsx';
import FlexContainer from '../components/FlexContainer.jsx';
import PlayerList from '../components/PlayerList.jsx';
import Text from '../components/Text.jsx';
import WinnerView from '../components/WinnerView.jsx';
import audioService from '../services/audioService';

/**
 * EndGamePage component.
 *
 * Shows the grid, player list and their scores.
 *
 * It is... inevitable.
 *
 * @returns {HTMLElement}
 */
const EndGamePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    audioService.play('applause.mp3');
  }, []);

  return (
    <Fader>
      <FlexContainer style={{ marginBottom: 15 }}>
        <Text>{`We have a winner!`}</Text>
        <FlexContainer style={{ marginTop: 15 }}>
          <WinnerView />
          <Text>The final scores...</Text>
          <PlayerList />
        </FlexContainer>
        <Button onClick={() => dispatch(setPage(Pages.Landing))}>Play again</Button>
      </FlexContainer>
    </Fader>
  );
};

export default EndGamePage;
