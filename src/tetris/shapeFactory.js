import '../index.css';

export const SHAPES = {
    // 네모 모양
    O: {
        shape: [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 }
        ],
        width: 2,
        height: 2,
        rotate: false,
        cno: 1
    },
    // I자 모양
    I: {
        shape: [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 2 },
            { x: 0, y: 3 }
        ],
        width: 1,
        height: 4,
        rotate: true,
        cno: 2
    },
    // L자 모양
    L: {
        shape: [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 2 },
            { x: 1, y: 2 }
        ],
        width: 1,
        height: 3,
        rotate: true,
        cno: 3
    },
    // 역 L자 모양
    J: {
        shape: [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 2 },
            { x: -1, y: 2 }
        ],
        width: 2,
        height: 3,
        rotate: true,
        cno: 4
    },
    // T자 모양
    T: {
        shape: [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 1, y: 1 }
        ],
        width: 3,
        height: 2,
        rotate: true,
        cno: 5
    },
    // Z자 모양
    Z: {
        shape: [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 1 }
        ],
        width: 3,
        height: 2,
        rotate: true,
        cno: 6
    },
    // 역 Z자 모양
    S: {
        shape: [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 1, y: 0 },
            { x: 2, y: 0 }
        ],
        width: 3,
        height: 2,
        rotate: true,
        cno: 7
    }
};


export const randomShape = () => {
    const shapes = Object.values(SHAPES);
    const randIndex = Math.floor(Math.random() * shapes.length);
    return shapes[randIndex];
};

