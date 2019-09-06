document.addEventListener('keypress', doSomething);

function doSomething(keypress){
  console.log(keypress);
  if (keypress.key == "+" || keypress.key == " " || keypress.key == "Enter"){
    window.location = nextPage(me);
  }
  else if (keypress.key == "-"){
    window.location = prevPage(me);
  }
}
