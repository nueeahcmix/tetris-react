import { useEffect, useState } from 'react';
import { useInterval } from './useInterval';
import { randomShape } from './shapeFactory';

export const ROW_COUNT = 20;
export const COLUMN_COUNT = 10;

function copyScene(scene) {
  return scene.map((row) => row.slice());
}

function mergeIntoStage(stage, shape, position) {
  let res = copyScene(stage);

  shape.shape.forEach((point) => {
    const x = point.x + position.x;
    const y = point.y + position.y;

    if (x < 0 || y < 0 || x >= COLUMN_COUNT || y >= ROW_COUNT) {
      return;
    }

    if (stage[y][x] === 0) {
      res[y][x] = shape.cno;
    }
  });

  return res;
}

function updateStage(stage, x, y, value) {
  if (stage[y][x] === value) {
    return stage;
  }
  const res = stage.slice();
  res[y] = stage[y].slice();
  res[y][x] = value;
  return res;
}

function createEmptyScene() {
  return Array.from(Array(ROW_COUNT), () => Array(COLUMN_COUNT).fill(0));
}

export function useBoard() {
  const [scene, setScene] = useState(() => createEmptyScene());
  const [shape, setShape] = useState(() => randomShape());
  const [position, setPosition] = useState({ x: Math.floor(COLUMN_COUNT / 2) - 1, y: 0 });
  const [display, setDisplay] = useState(() =>
    mergeIntoStage(scene, shape, position)
  );
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const [level, setLevel] = useState(1);
  const [linesCleared, setLinesCleared] = useState(0);

  const [paused, setPaused] = useState(true);

  const calculateDelay = () => {
    return Math.max(800 - (level * 100), 200);
  };

  useEffect(() => {
    const interval = calculateDelay();
    return () => clearInterval(interval);
  }, [level]);

  useEffect(() => {
    const interval = setInterval(tick, calculateDelay());
    return () => clearInterval(interval);
  }, [tick, calculateDelay]);

  useEffect(() => {
    if (gameOver) {
      setLinesCleared(0);
    }
  }, [gameOver]);

  useEffect(() => {
    const interval = setInterval(tick, calculateDelay());
    return () => clearInterval(interval);
  }, [tick, calculateDelay, paused]);

  useEffect(updateDisplay, [scene, shape, position]);
  useEffect(removeFullLines, [scene]);
  useInterval(tick, 700);

  function updateDisplay() {
    const mergedScene = mergeIntoStage(scene, shape, position);
    const display = mergedScene.slice(-ROW_COUNT);
    setDisplay(display);
  }

  function tick() {
    if (!paused && !gameOver) {
      if (!movePosition(0, 1)) {
        if (position.y === 0) {
          setGameOver(true);
          return;
        }
        placeShape();
      }
    } else if (gameOver) {
      return;
    }
  }



  function placeShape() {
    if (validPosition(position, shape)) {
      setScene(mergeIntoStage(scene, shape, position));
      setShape(randomShape());
      setPosition({ x: Math.floor(COLUMN_COUNT / 2) - 1, y: 0 });
    } else {
      setGameOver(true);
    }
  }


  function rotateShape() {
    const tX = Math.floor(shape.width / 2);
    const tY = Math.floor(shape.height / 2);

    const newPoints = shape.shape.map((point) => {
      let { x, y } = point;

      x -= tX;
      y -= tY;

      let rX = -y;
      let rY = x;

      rX += tX;
      rY += tY;

      return { x: rX, y: rY };
    });

    const newShape = {
      shape: newPoints,
      width: shape.width,
      height: shape.height,
      cno: shape.cno
    };

    let adjustedPosition = { x: position.x, y: position.y };

    if (!validPosition(adjustedPosition, newShape)) {
      adjustedPosition.x += 1;
      if (validPosition(adjustedPosition, newShape)) {
        setShape(newShape);
        setPosition(adjustedPosition);
        return;
      }

      adjustedPosition.x -= 2;
      if (validPosition(adjustedPosition, newShape)) {
        setShape(newShape);
        setPosition(adjustedPosition);
        return;
      }

      if (newShape.shape.length === 4) {
        adjustedPosition.x += 3;
        if (validPosition(adjustedPosition, newShape)) {
          setShape(newShape);
          setPosition(adjustedPosition);
          return;
        }

        adjustedPosition.x -= 4;
        if (validPosition(adjustedPosition, newShape)) {
          setShape(newShape);
          setPosition(adjustedPosition);
          return;
        }
      }
    }

    if (validPosition(position, newShape)) {
      setShape(newShape);
    } else {
      adjustedPosition.y += 1;
      if (validPosition(adjustedPosition, newShape)) {
        setShape(newShape);
        setPosition(adjustedPosition);
      }
    }
  }



  function removeFullLines() {
    const newScene = copyScene(scene);
    let clearedLines = 0;

    for (let y = ROW_COUNT - 1; y >= 0; y--) {
      if (newScene[y].every((cell) => cell !== 0)) {
        // 현재 행이 모두 채워져 있는 경우
        for (let x = 0; x < COLUMN_COUNT; x++) {
          // 현재 행의 각 열을 0으로 초기화
          newScene[y][x] = 0;
        }
        clearedLines++;
      } else if (clearedLines > 0) {
        // 현재 행이 비어있지 않고, 위의 행이 사라진 행이 있는 경우
        // 사라진 행만큼 현재 행을 아래로 이동
        newScene[y + clearedLines] = newScene[y];
        newScene[y] = Array(COLUMN_COUNT).fill(0);
      }
    }

    if (clearedLines > 0) {
      setScene(newScene);
      setScore((prevScore) => prevScore + 100 * clearedLines);
      setLinesCleared((prevLines) => prevLines + clearedLines);

      if (linesCleared + clearedLines >= 10) {
        setLevel((prevLevel) => prevLevel + 1);
        setLinesCleared(0);
      }
    }
  }
  
  function onKeyDown(event) {
    if (!gameOver) {
      switch (event.key) {
        case 'ArrowRight':
          movePosition(1, 0);
          event.preventDefault();
          break;
        case 'ArrowLeft':
          movePosition(-1, 0);
          event.preventDefault();
          break;
        case 'ArrowDown':
          movePosition(0, 1);
          event.preventDefault();
          break;
        case 'ArrowUp':
          rotateShape();
          event.preventDefault();
          break;
        case ' ':
        case 'Spacebar':
          dropShape();
          event.preventDefault();
          break;
        case 'p':
          togglePause();
          break;
        default:
          break;
      }
    } else if (event.key === 'Enter') {
      resetGame();
    }
  }

  function togglePause() {
    setPaused(!paused);
  }

  function dropShape() {
    let newY = position.y;

    while (validPosition({ x: position.x, y: newY + 1 }, shape)) {
      newY++;
    }
    setPosition({ x: position.x, y: newY });
  }

  function movePosition(x, y) {
    const res = { x: x + position.x, y: y + position.y };
    if (!validPosition(res, shape)) {
      return false;
    }

    setPosition(res);

    return true;
  }

  function validPosition(position, shape) {
    return shape.shape.every((point) => {
      const tX = point.x + position.x;
      const tY = point.y + position.y;

      if (tX < 0 || tX >= COLUMN_COUNT) {
        return false;
      }

      if (tY < 0 || tY >= ROW_COUNT) {
        return false;
      }

      if (scene[tY][tX] !== 0) {
        return false;
      }

      if (tY > 0 && scene[tY - 1][tX] !== 0) {
        return false;
      }

      return true;
    });
  }



  function resetGame() {
    setScene(createEmptyScene());
    setShape(randomShape());
    setPosition({ x: Math.floor(COLUMN_COUNT / 2) - 1, y: 0 });
    setScore(0);
    setGameOver(false);
    setLevel(1);
    setLinesCleared(0);
    setPaused(true);
  }

  function startGame() {
    setPosition({ x: Math.floor(COLUMN_COUNT / 2) - 1, y: 0 });
    setPaused(false);
  }


  return [display, score, onKeyDown, resetGame, gameOver, level, paused, togglePause, startGame];
}


