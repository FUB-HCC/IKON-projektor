<h1><a id="IKONprojektor_0"></a>IKON-projektor</h1>

<h3 style=„display: flex; align-items: center;“>Node <a href="https://nodejs.org/en/"><img src="https://ih1.redbubble.net/image.109336634.1604/flat,30x30,075,f.u1.jpg" alt="Node" title="Node"></a></h3>
<p>Installation for Mac via Homebrew<br>
<code>brew install node</code></p>
<p>Alternative without a package manager:<br>
<a href="https://nodejs.org/en/">nodejs.org</a></p>
<p>Make sure you are set<br>
<code>node -v</code><br>
<code>npm -v</code><br>
Both should print their respective version numbers</p>
<h3 style=„display: flex; align-items: center;“>React  <a href="https://reactjs.org/"><img src="https://ih1.redbubble.net/image.277330845.6641/flat,30x30,075,f.jpg" alt="React" title="React"><a/></h3>
<p>After successfully installing node and npm run following code in your console/terminal<br>
<code>npm install --save react</code><br>
<code>npm install --save react-scripts</code> (optional)</p>
<h3><a id="Launch_Instructions_27"></a>Launch Instructions:</h3>
<ul>
<li>navigate your console to your project folder</li>
  <li>install required header and library files with <code>npm install</code></li>
<li>start the development server with <code>npm start</code></li>
<li>the project is now hosted locally and in your network</li>
<li>usually the port is: <a href="http://localhost:3000/">http://localhost:3000/</a></li>
</ul>
<h3> How to add static content to currently empty pages of the app: </h3>
<ul>
<li> create a new javascript file, let's say <code>myHTML.js </code></li> 
<li> import React: <code> import React from 'react' </code>
<li> export a javascript object that contains the static html you wish to render (as JSX code) 
<p> Example: <code> export const myHTML = ('any standard HTML code here - even multiline') </code></p>
</li> 
<li> the only restriciton is, that there can only be 1 outermost component </li> 
<li> to style your html create a css file (anywhere but usually done in the same folder), in this example we call it 'myCSS.css' </li> 
<li> import your css file into the js file: <code> import classes from './myCSS.css' </code></li> 
<li> you can use your classes by giving an HTML Element a 'className' attribute and selecting the right class from the imported 'classes' object. 
<p> Example for styling a div with a class called '.divstyle' in the css: <code> &lt div className={classes.divstyle} &gt 'div content' &lt /div &gt </code>
</li>
<li> let's say you are done with your HTML and you want to render it in the 'About' section of the app:
<ul>
<li>navigate to <code>src/containers/about/About.js </code></li>
<li>let's say your js file is at <code>src/components/staticHTML/about/ </code>, then you can import your HTML: <code>import {myHTML} from '../../components/staticHTML/about/myHTML'</code>
<li>add it between the divs in the <code>render()</code> function of About.js like this: <code> {myHTML}</code></li>
</ul>
</ul>
<p> The app now renders your content in About ! </p>
