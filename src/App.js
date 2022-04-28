
import './App.css';
import AdminMinting from './components/AdminMinting';
import Home from './components/Home';


function App() {

let hello = "hello world"

console.log(hello + "bing bong ")

let food = "hamburger"

  return (

    <>
 <h2>
 {hello}
 </h2>

<Home data = {hello} data2 = {food}/>
<AdminMinting/>


    </>

  );
}

export default App;
