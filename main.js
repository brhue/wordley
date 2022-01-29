// let words = ['hello', 'alert', 'tarts', 'fears', 'group', 'shell', 'fight']

let randomIndex = Math.floor(Math.random() * words.length)
let wordToGuess = words[randomIndex]

console.log(wordToGuess)

let currentGuess = 0

let rows = document.querySelectorAll('.row')

let guess = ''
let guesses = []

buildKeyboard()

document.addEventListener('keydown', (e) => {
  handleInput(e.key)
  updateGame()
})

function updateGame() {
  for (let [i, guess] of guesses.entries()) {
    let row = rows[i]
    let tiles = [...row.children]
    let status = checkGuess(guess, wordToGuess)
    for (let [index, tile] of tiles.entries()) {
      tile.textContent = guess[index]
      if (status[index] == 0) {
        tile.classList.add('wrong', 'flip')
      } else if (status[index] == 1) {
        tile.classList.add('almost', 'flip')
      } else {
        tile.classList.add('correct', 'flip')
      }
    }
    updateKeyboard(status, guess)
  }
  let row = rows[currentGuess]
  let tiles = [...row.children]
  for (let [i, tile] of tiles.entries()) {
    let letter = guess[i]
    if (letter) {
      tile.textContent = letter
      tile.classList.add('pop-in')
    } else {
      tile.textContent = ''
      tile.classList.remove('pop-in')
    }
  }
}

function handleInput(key) {
  if (isAlpha(key) && guess.length < 5) {
    guess = guess + key
  } else if (key === 'Backspace' && guess.length > 0) {
    guess = guess.slice(0, guess.length - 1)
  } else if (key === 'Enter') {
    if (guess.length < 5) {
      alert('guess too short')
      return
    }
    if (!(words.includes(guess) || validWords.includes(guess))) {
      alert('word not in word list')
      return
    }
    guesses.push(guess)
    currentGuess++
    guess = ''
  }
}

function isAlpha(key) {
  return 'abcdefghijklmnopqrstuvwxyz'.includes(key)
}

// FIXME: Currently we will incorrectly show that a correct letter
// is simultaneously also still present in the word even if it only appears once.
// Probably need to track letter counts or something prioritizing correct ones over
// present ones.

// Returns an array with the status of each letter
// 0 - not used
// 1 - used wrong spot
// 2 - used correct spot
function checkGuess(guess, secretWord) {
  let res = guess.split('').map((letter, index) => {
    if (!secretWord.includes(letter)) {
      return 0
    }
    if (secretWord[index] === letter) {
      return 2
    }
    return 1
  })
  return res
}

function buildKeyboard() {
  let keyboard = document.querySelector('.keyboard')
  let topRowKeys = 'qwertyuiop'.split('')
  let middleRowKeys = 'asdfghjkl'.split('')
  let bottomRowKeys = 'enter,z,x,c,v,b,n,m,delete'.split(',')

  let topRow = buildKeyboardRow(topRowKeys)
  let middleRow = buildKeyboardRow(middleRowKeys)
  let bottomRow = buildKeyboardRow(bottomRowKeys)

  keyboard.append(topRow, middleRow, bottomRow)

  keyboard.addEventListener('click', (e) => {
    if (!e.target.matches('.keyboard-key')) return
    let key = e.target.textContent
    if (key === 'enter') key = 'Enter'
    if (key === 'delete') key = 'Backspace'
    handleInput(key)
    updateGame()
  })
}

function buildKeyboardRow(keys) {
  let row = document.createElement('div')
  row.classList.add('keyboard-row')
  for (let key of keys) {
    let keyEl = document.createElement('button')
    keyEl.classList.add('keyboard-key')
    keyEl.textContent = key
    row.appendChild(keyEl)
  }
  return row
}

function updateKeyboard(status, guess) {
  let keys = [...document.querySelectorAll('.keyboard-key')]
  status.forEach((position, i) => {
    let key = keys.find((k) => k.textContent === guess[i])
    if (!key) return
    if (position === 0) {
      key.classList.add('wrong')
    } else if (position === 1) {
      key.classList.add('almost')
    } else {
      key.classList.add('correct')
    }
  })
}
