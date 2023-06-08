import './index.css';
import * as React from 'react'
import { Reset } from 'styled-reset'
import Board from './tetris/board';

function App() {
  return (
    <>
      <React.Fragment>
        <Reset />
      </React.Fragment>
      <Board />
    </>
  );
}

export default App;
