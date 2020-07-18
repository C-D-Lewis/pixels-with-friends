import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPage } from '../actions';
import { Pages } from '../constants';
import Button from '../components/Button.jsx';
import Fader from '../components/Fader.jsx';
import FlexContainer from '../components/FlexContainer.jsx';
import PlayerList from '../components/PlayerList.jsx';
import Text from '../components/Text.jsx';
import Subtitle from '../components/Subtitle.jsx';
import WinningTeamView from '../components/WinningTeamView.jsx';
import StatsTable from '../components/StatsTable.jsx';
import audioService from '../services/audioService';

/**
 * EndGamePage component.
 *
 * Shows the grid, player list and their scores.
 * It is... inevitable.
 *
 * @returns {HTMLElement}
 */
const EndGamePage = () => {
  const dispatch = useDispatch();

  // Play applause when shown
  useEffect(() => audioService.play('applause.mp3'), []);

  // TOOD - stats - most points, conversions, most runs, best run length

  return (
    <Fader>
      <FlexContainer style={{ marginBottom: 15 }}>
        <FlexContainer style={{ marginTop: 5 }}>
          <WinningTeamView />
          <Subtitle color="white">The final scores:</Subtitle>
          <PlayerList />
        </FlexContainer>
        <FlexContainer style={{ marginTop: 5 }}>
          <Subtitle color="white">Detailed stats:</Subtitle>
          <StatsTable />
        </FlexContainer>
        <FlexContainer style={{ marginTop: 10 }}>
          <Button onClick={() => dispatch(setPage(Pages.Landing))}>Play again</Button>
        </FlexContainer>
      </FlexContainer>
    </Fader>
  );
};

export default EndGamePage;
