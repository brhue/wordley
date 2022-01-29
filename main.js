// let words = ['hello', 'alert', 'tarts', 'fears', 'group', 'shell', 'fight']

let randomIndex = Math.floor(Math.random() * words.length)
let wordToGuess = words[randomIndex]

console.log(wordToGuess)

let currentGuess = 0
let currentLetter = 0

let rows = document.querySelectorAll('.row')

let guess = ''

buildKeyboard()

document.addEventListener('keydown', (e) => {
  if (isAlpha(e.key) && currentLetter < 5) {
    guess = guess + e.key
    let currentRow = rows[currentGuess]
    let letters = currentRow.querySelectorAll('.letter-spot')
    let letter = letters[currentLetter]

    let span = document.createElement('span')
    let text = document.createTextNode(e.key)
    span.appendChild(text)
    letter.classList.add('pop-in')
    letter.appendChild(span)
    currentLetter++
  } else if (e.key === 'Backspace') {
    if (guess.length > 0) {
      guess = guess.slice(0, guess.length - 1)
      let currentRow = rows[currentGuess]
      let letters = currentRow.querySelectorAll('.letter-spot')
      let letter = letters[currentLetter - 1]
      letter.innerHTML = ''
      letter.classList.remove('pop-in')
      currentLetter--
    }
  } else if (e.key === 'Enter') {
    if (!(words.includes(guess) || validWords.includes(guess))) {
      alert('word not in word list')
      return
    }
    if (guess.length === 5) {
      let status = checkGuess(guess, wordToGuess)
      let currentRow = rows[currentGuess]
      let letters = currentRow.querySelectorAll('.letter-spot')
      letters.forEach((letter, index) => {
        if (status[index] == 0) {
          letter.classList.add('wrong', 'flip')
        } else if (status[index] == 1) {
          letter.classList.add('almost', 'flip')
        } else {
          letter.classList.add('correct', 'flip')
        }
      })
      updateKeyboard(status)
      currentGuess++
      currentLetter = 0
      guess = ''
    }
  }
})

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
    if (e.target.matches('.keyboard-key')) {
      let key = e.target.textContent
      if (isAlpha(key) && guess.length < 5) {
        guess = guess + key
        let currentRow = rows[currentGuess]
        let letters = currentRow.querySelectorAll('.letter-spot')
        let letter = letters[currentLetter]

        let span = document.createElement('span')
        let text = document.createTextNode(key)
        span.appendChild(text)
        letter.classList.add('pop-in')
        letter.appendChild(span)
        currentLetter++
      } else if (key === 'delete' && guess.length > 0) {
        guess = guess.slice(0, guess.length - 1)
        let currentRow = rows[currentGuess]
        let letters = currentRow.querySelectorAll('.letter-spot')
        let letter = letters[currentLetter - 1]
        letter.innerHTML = ''
        letter.classList.remove('pop-in')
        currentLetter--
      } else if (key === 'enter') {
        if (!(words.includes(guess) || validWords.includes(guess))) {
          alert('word not in word list')
          return
        }
        if (guess.length === 5) {
          let status = checkGuess(guess, wordToGuess)
          let currentRow = rows[currentGuess]
          let letters = currentRow.querySelectorAll('.letter-spot')
          letters.forEach((letter, index) => {
            if (status[index] == 0) {
              letter.classList.add('wrong', 'flip')
            } else if (status[index] == 1) {
              letter.classList.add('almost', 'flip')
            } else {
              letter.classList.add('correct', 'flip')
            }
          })
          updateKeyboard(status)
          currentGuess++
          currentLetter = 0
          guess = ''
        }
      }
    }
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

function updateKeyboard(status) {
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
