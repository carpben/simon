// const COLORS = {
//   red : 0,
//   green: 1,
//   blue: 2,
//   yellow: 3
// }

const COLORNAMES = ["red", "green", "blue", "yellow"]
function SimonGame (options){
  state = {
    challenge:20,
    colorSquence:[],
    highlightedColor: null,
    usersTurn: false
  }



  // function renderCircles(view){
  //   console.log('renderS')
  //   let html = ''
  //
  //   html = `<div id="outer-circle"><div id="inner-circle"></div></div>`
  //   console.log(html)
  //   options.el.innerHTML = html
  // }

  function getRandomColorName (){
    return COLORNAMES[Math.floor(Math.random() * COLORNAMES.length)]
  }
  function addColorToSequence(){
    state.colorSquence.push(getRandomColorName())
  }


  function render (){
    // let colorClasses = {
    //   red: 'red',
    //   yellow: 'yellow',
    //   blue: 'blue',
    //   green: 'green'
    // }
    // if(state.highlightedColor)
    //   colorClasses[state.highlightedColor] += ' light'
    //
    //  function getSquareHtml (colorName){
    //    return `<div id="${colorName}" class="color-square ${colorClasses[colorName]}}" ></div>`
    //  }


     let board =COLORNAMES.reduce((accu, color)=>{
       let extraclass = state.highlightedColor === color ? 'light' : ''
       return accu + `<div id="${color}" class="color-square ${extraclass}"></div>`
     }, "")

     let title = `<div id="title" class="text-center"><h1>Simon</h1></div>`
     const steps = state.colorSquence.length

     let control = `<div id="control"><button type="button" class="btn btn-default btn-lg">GO!</button>
     <div id="steps"><h3>STEPS: <span> ${steps} </span></h3></div><div id="challenge"><h3>challenge: <span> ${state.challenge} </span></h3></div></div>`

     options.el.innerHTML = `${title}  <div id='board'> ${board} </div>  ${control}`
     return

    //renders the screen whenever called, based on the state object.
    // let row1 = `<div class="row"><div id="${COLORSIDS[COLORS.red]}" class="color-square ${COLORSCLASSES[COLORS.red]} ${state.highlightedColor == COLORS.red ? 'light' : ''}" ></div><div id="${COLORSIDS[COLORS.green]}" class="color-square ${COLORSCLASSES[COLORS.green]}"></div></div>`
    // let row2 = `<div class="row"><div id="${COLORSIDS[COLORS.blue]}" class="color-square ${COLORSCLASSES[COLORS.blue]}"></div><div id="${COLORSIDS[COLORS.yellow]}" class="color-square ${COLORSCLASSES[COLORS.yellow]}"></div></div>`
    //
    // options.el.innerHTML =
  }
  // function renderBrightenColor (colorInt){
  //   $(`#${COLORSIDS[colorInt]}`).addClass('light');
  //   setTimeout(function(){renderBrightenColor(colorInt)}, 2000)
  // }
  // function renderDeBrightenColor (colorInt){
  //   $(`#${COLORSIDS[colorInt]}`).removeClass('light');
  // }

  // setTimeout(renderBrightenColor(COLORS.yellow), 3000)
  // setTimeout(function(){renderBrightenColor(COLORS.yellow)}, 3000)

  function brightenColor(color){
    state.highlightedColor = color
    render()
    setTimeout(function(){deBrightenColors()}, 1300)
  }

  function deBrightenColors(){
    state.highlightedColor = null
    render()
  }

  function colorsShow(colorToDemo=[]) {
    if(colorToDemo.length === 0) {
      state.usersTurn = true
      return
    }
    let color = colorToDemo.pop()
    brightenColor(color);
    setTimeout(function(){colorsShow(colorToDemo)},2500)
  }

  function nextStep(){
    addColorToSequence()
    setTimeout(colorsShow(state.colorSquence), 1000)
  }

  function userHandler (){
    step = 0
    let selectedColor;

    function colorSelected(color){
      selectedColor=color
      if (state.colorSquence[step]===selectedColor){
      brightenColor(color)
      step++
      }
      if (step = state.colorSquence.length){
        state.usersTurn=False
        setTimeout (nextStep, 2000)
      }
    }
    function handleClickedColor (color){
      if (!state.usersTurn){return}
      colorSelected(color)
    }

    COLORNAMES.forEach(color=>{
      let selector = options.el.querySelector(`#${color}`)
      selector.addEventListener('click', function(){
        handleClickedColor(color)
      })
    })
  }

    // selectors = {
    //   var red : document.querySelector('#red')
    //   var green : document.querySelector('#green')
    //   var yellow : document.querySelector('#yellow')
    // }
    // red.addEventListener('click', onclick)




  render()
  userHandler()

  const button = options.el.querySelector('button')
  button.addEventListener('click', nextStep);



}

const simonGame = new SimonGame ({
  el: document.querySelector('#root')
  // el : document.getElementById('root')
})
