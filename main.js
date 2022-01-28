// let words = ['hello', 'alert', 'tarts', 'fears', 'group', 'shell', 'fight']

let randomIndex = Math.floor(Math.random() * words.length)
let wordToGuess = words[randomIndex]

console.log(wordToGuess)

let currentGuess = 0
let currentLetter = 0

let rows = document.querySelectorAll('.row')

let guess = ''

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
      console.log(status)
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
      currentGuess++
      currentLetter = 0
      guess = ''
    }
  }
})

function isAlpha(key) {
  return 'abcdefghijklmnopqrstuvwxyz'.includes(key)
}

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
