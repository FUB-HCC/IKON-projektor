const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);
  
//////////////// Header //////////////////
modifyHeader(me);

//////////////// Content //////////////////  
layout.append("h1").text("Gibt es Fragen?");

//////////////// Footer //////////////////  
modifyFooter(me);
