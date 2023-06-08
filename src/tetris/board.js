import React, { memo, useEffect, useRef, useState } from 'react';
import { useBoard } from "./useBoard";
import '../index.css';
import tetrisMusic from './tetris.mp3';
import { SHAPES } from './shapeFactory';
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";
import { MdSpaceBar } from "react-icons/md";
import { RxDotFilled } from "react-icons/rx";
import img1 from "../img/tetris-icon1.png";
import img2 from "../img/tetris-icon2.png";
import img3 from "../img/tetris-icon3.png";
import img4 from "../img/tetris-icon4.png";
import img5 from "../img/tetris-icon5.png";
import img6 from "../img/tetris-icon6.png";
import img7 from "../img/tetris-icon7.png";
import img8 from "../img/tetris-icon8.png";
import img9 from "../img/tetris-icon9.png";
import img10 from "../img/tetris-icon10.png";
import img11 from "../img/tetris-icon11.png";
import img12 from "../img/tetris-icon12.png";

const Board = () => {
    const [display, score, onKeyDown, resetGame, gameOver, level, paused, setPaused, startGame] = useBoard();
    const [musicLoaded, setMusicLoaded] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const eBoard = useRef();
    const audioRef = useRef();

    // 랜덤이미지 
    const icon = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12];
    const [randomImage, setRandomImage] = useState('');

    useEffect(() => {
        const getRandomImage = () => {
            const randomIndex = Math.floor(Math.random() * icon.length);
            return icon[randomIndex];
        };

        const interval = setInterval(() => {
            const image = getRandomImage();
            setRandomImage(image);
        }, 20000);

        // 페이지 로딩 시에도 랜덤 이미지 설정
        const initialImage = getRandomImage();
        setRandomImage(initialImage);

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(focusBoard, []);
    useEffect(() => {
        if (musicLoaded && !paused) {
            playMusic();
        } else {
            stopMusic();
        }
    }, [musicLoaded, paused]);

    function focusBoard() {
        eBoard.current.focus();
    }

    function loadMusic() {
        setMusicLoaded(true);
    }

    function playMusic() {
        audioRef.current.play();
    }

    function stopMusic() {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }

    function handleGameStart() {
        startGame();
        loadMusic();
    }

    const togglePause = () => {
        setPaused(!paused);
        if (paused) {
            stopMusic();
        } else {
            playMusic();
        }
    };

    const GameOver = ({ resetGame }) => {
        useEffect(() => {
            stopMusic();
        }, []);

        return (
            <div className="game-over">
                <span>Game Over</span>
                <button onClick={resetGame}>Restart</button>
            </div>
        );
    };

    const InstructionsModal = () => {
        const closeModal = () => {
            setShowInstructions(false);
        };

        return (
            <div className={`modal ${showInstructions ? 'show' : ''}`}>
                <div className="modal-content">
                    <h2>게임방법</h2>
                    <p><RxDotFilled id='icon' /> 테트리스는 블록의 행을 제거하여 가능한 많은 점수를 얻는 게임입니다.</p>
                    <p><RxDotFilled id='icon' /> 10줄을 제거할 때마다 레벨이 1씩 오르며, 블록의 속도가 빨라집니다.</p>
                    <p><AiOutlineCaretUp id='icon' />위쪽 방향키 : 블록의 모양이 바뀝니다.</p>
                    <p><AiOutlineCaretDown id='icon' />아래쪽 방향키 : 블록이 빠르게 내려갑니다.</p>
                    <p><MdSpaceBar id='icon' />스페이스바 : 블록이 한번에 맨 아래로 내려갑니다.</p>
                    <p>'p' : 게임이 일시정지됩니다.</p>
                    <button onClick={closeModal}>닫기</button>
                </div>
            </div>
        );
    };

    return (
        <div id='tetris-container'>
            <div className='container'>

                <div className='wrap'>
                    <img src={randomImage} alt="icon" className='random-icon' />
                    <button onClick={() => setShowInstructions(true)} className="info-button"></button>
                    <div className='main-display-continer'>
                        <div className='t-board' tabIndex={0} onKeyDown={onKeyDown} ref={eBoard}>
                            {display.map((row, index) => <Row row={row} key={index} />)}
                            {gameOver ? (
                                <GameOver resetGame={resetGame} />
                            ) : (
                                ''
                            )}
                            <div className='button'>
                                <button onClick={handleGameStart}
                                    className="start-button">START
                                </button>
                                <button onClick={togglePause}
                                    className="pause-button">
                                    {paused ? 'RESUME' : 'PAUSE'}
                                </button>
                            </div>
                        </div>
                        <div className='t-score'>
                            <p className="t-score-label">SCORE : {score.toLocaleString()}</p>
                            <p className="t-score-label"> LEVEL : {level}</p>
                        </div>
                    </div>
                </div>


            </div>
            {showInstructions && <InstructionsModal />}
            <audio ref={audioRef} src={tetrisMusic} loop />
        </div>
    );
};

const Row = memo(props => {
    return (
        <span className='t-row'>
            {props.row.map((cell, index) => <Cell cell={cell} key={index} />)}
        </span>
    );
});

const shapeColors = {
    0: 't-cell-0',
    1: 't-cell-1',
    2: 't-cell-2',
    3: 't-cell-3',
    4: 't-cell-4',
    5: 't-cell-5',
    6: 't-cell-6',
    7: 't-cell-7'
};

const Cell = memo((props) => {
    const count = useRef(0);
    count.current++;
    const value = props.cell ? props.cell : 0;
    const colorClass = `t-cell ${shapeColors[value]}`;

    return <span className={colorClass}></span>;
});

export default memo(Board);