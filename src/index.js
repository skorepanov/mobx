import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import DevTools from 'mobx-react-devtools';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <DevTools />
        <h1>Hello world!</h1>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
