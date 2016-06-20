import React from 'react';

import { connect } from 'react-redux';

import { tab } from '../reducers';

import { YELLOW, GRAY, PINK } from '../colors';

import Visualizer from './Visualizer';
import Toolbar from './Toolbar';
import Editor from './Editor';
import Library from './Library';
import Help from './Help';

const optstring = React.PropTypes.string;
const string = React.PropTypes.string.isRequired;

const appContainerStyle = {
  display: 'flex',
  width: '100%',
  minHeight: '100%',
  maxHeight: '100vh',
  flex: 1,
  backgroundColor: GRAY,
};

const headerStyle = {
  display: 'flex',
  height: '72px',
  lineHeight: '72px',
  fontSize: '18pt',
  flexShrink: '0',
};

const titleStyle = {
  color: YELLOW,
  fontWeight: 600,
};

const errorIconStyle = {
  color: PINK,
  fontSize: '20pt',
  height: '72px',
  width: '72px',
  lineHeight: '72px',
  textAlign: 'center',
};

const mainSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  padding: '0 0 0 1em',
};

function App(props) {
  return (<div style={appContainerStyle}>
    <MainSection tab={props.tab} error={props.error} />
    <Toolbar />
  </div>);
}
App.propTypes = { tab: string, error: optstring };

function MainSection(props) {
  let content;
  switch (props.tab) {
    case tab.EDITOR: content = <Editor />; break;
    case tab.LIBRARY: content = <Library />; break;
    case tab.HELP: content = <Help />; break;
    default: break;
  }
  return (<div style={mainSectionStyle}>
    <Header error={props.error} />
    {content}
  </div>);
}
MainSection.propTypes = { tab: string, error: optstring };

function Header({ error }) {
  return (<div style={headerStyle}>
    <Title />
    <ErrorIcon error={error} />
    <Visualizer />
  </div>);
}
Header.propTypes = { error: optstring };

function Title() {
  return (<div style={titleStyle}>
    #glitch
  </div>);
}

function ErrorIcon({ error }) {
  const style = Object.assign({}, errorIconStyle, { visibility: (error ? 'visible' : 'hidden') });
  return <i className="fa fa-exclamation-triangle" style={style}></i>;
}
ErrorIcon.propTypes = { error: optstring };

function mapStateToProps(state) {
  return { tab: state.navigation.tab, error: state.expr.error };
}

export default connect(mapStateToProps)(App);
