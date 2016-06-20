// Importing assets: HTML, CSS and fonts
import './index.html';
import './favicon.png';
import './glitch180x180.png';
import './glitch192x192.png';
import 'font-awesome/css/font-awesome.css';
import './styles.css';
import './roboto.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';

import Layout from './jsx/Layout';
import { expr, playback, navigation, playbackMode, tab } from './reducers';

import * as actions from './actions';
import * as audio from './audio';
import { saveFile, waveFile } from './save';

import Glitch from './glitch';

const glitch = new Glitch(audio.sampleRate);

function exportWavFile(sampleRate, expression) {
  const glitchRenderer = new Glitch(sampleRate);
  glitchRenderer.compile(expression);
  saveFile('glitch.wav',
           waveFile(30, sampleRate, glitchRenderer.nextSample.bind(glitchRenderer)),
           'audio/wav');
}

// Calls audio service on PLAY and STOP actions
const audioMiddleware = store => next => action => {
  switch (action.type) {
    case actions.PLAY: glitch.reset(); audio.play(glitch.onaudioprocess.bind(glitch)); break;
    case actions.STOP: audio.stop(); break;
    case actions.SET_EXPR:
      clearTimeout(audioMiddleware.errorTimeout);
      if (!glitch.compile(action.expr)) {
        audioMiddleware.errorTimeout = setTimeout(() =>
          store.dispatch(actions.error('syntax error')), 500);
      } else {
        localStorage.setItem('expr', action.expr);
        store.dispatch(actions.error());
      }
      break;
    case actions.EXPORT_WAV:
      exportWavFile(audio.sampleRate, store.getState().expr.expr);
      break;
    default:
  }
  return next(action);
};

// Changes location URI hash whenever expression is changed
const uriMiddleware = store => next => action => {
  const res = next(action);
  if (!store.getState().expr.error) {
    window.location.hash = encodeURIComponent(store.getState().expr.expr);
  }
  return res;
};

const store = createStore(combineReducers({
  expr,
  playback,
  navigation,
}), applyMiddleware(
  audioMiddleware,
  uriMiddleware
));

// Initialize glitch with default/current expression, optionally do autoplay
if (window.location.hash) {
  store.dispatch(actions.setExpr(decodeURIComponent(window.location.hash.substring(1))));
} else if (localStorage.getItem('expr')) {
  store.dispatch(actions.setExpr(localStorage.getItem('expr')));
} else {
  store.dispatch(actions.setExpr(store.getState().expr.expr));
}
if (window.location.search === '?play') {
  store.dispatch(actions.play());
}

document.onmousemove = (e) => {
  glitch.vars.x(e.pageX / window.innerWidth);
  glitch.vars.y(e.pageY / window.innerHeight);
};

document.onkeydown = (e) => {
  if (e.keyCode === 13 && e.ctrlKey) {
    if (store.getState().playback.mode === playbackMode.PLAYING) {
      store.dispatch(actions.stop());
    } else {
      store.dispatch(actions.play());
    }
  }
};

window.onload = () => {
  ReactDOM.render(<Provider store={store}><Layout /></Provider>,
                  document.getElementById('container'));
};
