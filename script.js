const TURN = {
  computer: 0,
  user: 1
}

const COLORNAMES = ["red", "green", "blue", "yellow"]

function SimonGame (options){
  state = {
    challenge:6,
    strict: false,
    colorSequence:[],
    squareClickReady: false,
    highlightedColor: null,
    mistake: false,
    levelSuccess: false,
    gameSuccess: false,
  }

  function render (){
    WinText=["You", "Made", "It", "!!!"]

    let title = `<div id="title" class="text-center"><h1>Simon</h1></div>`
    const steps = state.colorSequence.length

    let board =COLORNAMES.reduce((accu, color, indx)=>{
      let extraclass = state.highlightedColor === color ? 'light' : ''
      return accu + `<div id="${color}" data-color="${color}" class="color-square ${extraclass}">
      ${ (state.gameSuccess) ? WinText[indx] : "" } </div>`
    }, "")

    let control = `<div id="control"><button type="button" id="start" class="btn btn-default btn-lg">GO!</button>
    <button id="strict" type="button" class="btn btn-default ${state.strict? "active" : "" }"> Strict </button>
    <div id="steps"><h3>STEPS: <span> ${steps} </span></h3></div><div id="challenge"><h3>challenge: <span> ${state.challenge} </span></h3></div></div>`

    options.el.innerHTML = `${title}  <div id='board'> ${board} </div>  ${control}`

    let soundURL = ""
    if (state.gameSuccess){soundURL = "/celebration.wav"}
    else if (state.mistake){soundURL = "/mistake.mp3"}
    else if (state.success){soundURL = "/success.wav"}
    else if (state.highlightedColor){
     const colorsoundURL = {
       red: "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
       green: "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
       blue: "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
       yellow: "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3",
     }
     soundURL = colorsoundURL[state.highlightedColor]
    }

    if (soundURL){
      var audio = new Audio(soundURL);
      audio.play();
    }
  }

  function brightenColor(color){
    function deBrightenColors(){
      state.highlightedColor = null
      render()
    }

    state.highlightedColor = color
    render()
    return new Promise(function(resolve,reject){
      setTimeout(function(){
        deBrightenColors()
        resolve()
      }, 800)
    })
  }


//------   USER   -------

function startUserTurn(){
  //reset some state stuff
  state.squareClickReady = true
  state.mistake = false
  state.success = false
  state.step=0
}

function handleUserMistake(){
  state.mistake = true
  render()
  state.mistake = false
  if (state.strict){
    setTimeout(
      function(){
        startNewGame()
        }
    , 2800)
  }
  else {
    setTimeout(
      function(){
        showSequence(state.colorSequence)
          .then(()=>{startUserTurn()})
        }
    , 2800)
  }
}

function handleLevelSuccess(){
  state.squareClickReady = false
  state.success = true
  render()
  state.success = false
  setTimeout(startNextlevel, 2500 )
}

function handleGameSuccess(){
  state.gameSuccess = true
  render()
}

function colorSquareClicked(color){
  if (!state.squareClickReady){return}
  state.squareClickReady=false

  if (state.colorSequence[state.step]!==color) {
    handleUserMistake()
    return
  }

  state.step++
  brightenColor(color)
    .then(()=>{
      if (state.step==state.challenge){
        handleGameSuccess()
      }
      else if (state.step === state.colorSequence.length){
        handleLevelSuccess()
      } else {
        state.squareClickReady = true
      }
    })
}
//-----------------------

//------   challenge   -------

function addColorToSequence(){
  let randomColor = COLORNAMES[Math.floor(Math.random() * COLORNAMES.length)]
  state.colorSequence.push(randomColor)
}

function showSequence(colorSequence=[]) {
  colorSequence = colorSequence.slice(0)
  const DELAY = 175

  if(colorSequence.length === 0) {
    return new Promise (function(resolve, reject){
      resolve()
    })
  }

  let color = colorSequence.shift()
  return brightenColor(color)
    .then(()=>{
      setTimeout(function(){showSequence(colorSequence)},DELAY)
    })
}

function startNextlevel(){
  addColorToSequence()
  showSequence(state.colorSequence).then(()=>{
    startUserTurn()
  })
}



//----------------------------

//------   Button Handlers   -------

function startNewGame(){
  state.colorSequence=[]
  startNextlevel()
}

function toggleStrictMode(){
  state.strict = (!state.strict)
  render()
}


  render()

  $(options.el).on('click', `.color-square`, function(ev){
    colorSquareClicked($(ev.currentTarget).attr('data-color'))
  })
  $(options.el).on('click', '#start', startNewGame)
  $(options.el).on('click', '#strict', toggleStrictMode )

}

const simonGame = new SimonGame ({
  el: document.querySelector('#root')
  // el : document.getElementById('root')
})
