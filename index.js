const gameArea = document.querySelector('.game-area')
const startBtn = document.querySelector('.start-btn')
const scoreEl = document.querySelector('.score-el')
const highscoreEl = document.querySelector('.highscore-el')
const width = 10
const fruits = [
    {
        fruit: '🍎',
        points: 1
    },
    {
        fruit: '🍇',
        points: 2
    },
    {
        fruit: '🍒',
        points: 5
    },
    {
        fruit: '🍑',
        points: 10
    },
    {
        fruit: '🍍',
        points: 20
    }
]
let currentFruit = 0
let squares = []
let currentSnake = [2, 1, 0]
let score = 0
let direction = 1
let timerId = 0
let fruitIndex = 0
let speed = 0.9
let intervalTime = 1000

function createGrid() {
    for(let i = 0; i < width * width; i++) {
        const square = document.createElement('div')
        square.classList.add('square')
        gameArea.appendChild(square)
        squares.push(square)
    }
}
createGrid()

function snakeBuild() {
    currentSnake.forEach(i => {
        squares[i].classList.remove('tail')
        if(i === 0) {
            squares[i].classList.add('tail')
        }else if(i === currentSnake.length - 1) {
            squares[i].classList.add('head')
        }
        squares[i].classList.add('snake')
    })
}
snakeBuild()

function start() {
    currentSnake.forEach(i => squares[i].classList.remove('snake', 'tail', 'head'))
    squares[fruitIndex].classList.remove('apple')
    clearInterval(timerId)
    currentSnake = [2, 1, 0]
    score = 0
    scoreEl.textContent = `Score: ${score}`
    direction = 1
    intervalTime = 1000
    genApple()
    snakeBuild()
    timerId = setInterval(move, intervalTime)
}

function die() {
    clearInterval(timerId)
    localStorage.setItem('highscore', score)
    highscoreEl.textContent = `Highscore: ${localStorage.getItem('highscore')}`
}

function move() {
    if(
        (currentSnake[0] + width >= width * width && direction === width) ||
        (currentSnake[0] - width < 0 && direction === -width) ||
        (currentSnake[0] % width === width - 1 && direction === 1) ||
        (currentSnake[0] % width === 0 && direction === -1) ||
        squares[currentSnake[0] + direction].classList.contains('snake')
    )
    return die()

    const tail = currentSnake.pop()
    squares[tail].classList.remove('snake', 'tail')
    squares[currentSnake[0]].classList.remove('head')
    currentSnake.unshift(currentSnake[0] + direction)

    if(squares[currentSnake[0]].classList.contains('apple')) {
        squares[currentSnake[0]].classList.remove('apple')
        squares[tail].classList.add('snake')
        currentSnake.push(tail)
        score += fruits[currentFruit].points
        scoreEl.textContent = `Score: ${score}`
        genApple()
        clearInterval(timerId)
        intervalTime = intervalTime * speed
        timerId = setInterval(move, intervalTime)
    }

    squares[currentSnake[0]].classList.add('snake', 'head')
    squares[currentSnake[currentSnake.length - 1]].classList.add('tail')
    // squares[currentSnake[0 + direction]].classList.add('head')
}

function genApple() {
    squares[fruitIndex].textContent = ''
    do {
        fruitIndex = Math.floor(Math.random() * squares.length)
        let rando = Math.floor(Math.random() * 16)
        rando < 6 ? currentFruit = 0 : rando < 10 ? currentFruit = 1 : rando < 13 ? currentFruit = 2 : rando < 15 ? currentFruit = 3 : currentFruit = 4
    } while (squares[fruitIndex].classList.contains('snake'))
    squares[fruitIndex].classList.add('apple')
    squares[fruitIndex].textContent = fruits[currentFruit].fruit
}

function control(e) {
    if(e.code === 'ArrowUp') {
        direction = -width
    }else if(e.code === 'ArrowDown') {
        direction = +width
    }else if(e.code === 'ArrowLeft') {
        direction = -1
    }else if(e.code === 'ArrowRight') {
        direction = 1
    }
}

startBtn.addEventListener('click', start)
document.addEventListener('keyup', control)