import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store'
import { Provider } from 'react-redux'
import { retrieveHistoricData } from './reducers/weatherData'
import { retrieveForecastData } from './reducers/weatherForecast';

/**
 * Getting default data from the server 
 */
store.dispatch(retrieveHistoricData("data/Horsens", false, null, null));
store.dispatch(retrieveForecastData("forecast/Horsens", false, null, null));

ReactDOM.render(
  //added provider for react-redux
  <Provider store = {store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
