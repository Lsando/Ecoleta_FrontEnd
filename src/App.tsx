import React /*,{useState}*/ from 'react';
import './App.css';
//import Header from './Header';

//Estados sao informcaoes mantidas pelo proprio componente (useState)
//Imutabilidade nao pode alterar - se um valor de uma constante de forma directa
/*
  Quando alteramos o estado de uma compoonente ela reflete directamente na interface / tela
  CONCEITOS FUNDAMENTAIS DO REACT
  * JSX
  * COMPONENTE (HEADER)
  * COMPONENTE
  * ESTADO E IMUTABILIDADE

*/
import Routes from './routes';

function App() {
  /*const [counter, setCounter] = useState(0);
  
  
  function handleButtonClick(){
    setCounter(counter + 1);
  }

  return (
    <div>
      <Header title="Ola mundo!"/>
      <h3>{counter}</h3>
      <button type="button" onClick={handleButtonClick}>Aumentar</button>
    </div>
    */
   return (
    <Routes />
   );
  //);
}

export default App;
