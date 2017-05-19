function SimonGame (options){

  function render(view){
    console.log('renderS')
    let html = ''

    html = `<div id="outer-circle"><div id="inner-circle"></div></div>`
    console.log(html)
    options.el.innerHTML = html
  }

  render ()
}

const simonGame = new SimonGame ({
  el : document.getElementById('root')
})
