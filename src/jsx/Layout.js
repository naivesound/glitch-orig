import React from 'react';

import { GREEN, GRAY, PINK } from '../colors';

import App from './App';

export function isElectron() {
  return window && window.process && window.process.type;
}

const layoutStyle = {
  backgroundColor: GREEN,
  fontFamily: 'Roboto Mono, monospace',
  height: '100vh',
};

const flexColumStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  justifyContent: 'space-around',
  alignItems: 'center',
};

const appContainerStyle = {
  display: 'flex',
  width: '800px',
  minHeight: '500px',
  maxHeight: '500px',
  boxShadow: '8px 8px 0px 0px rgba(0,0,0,0.5)',
};

const headerStyle = {
  display: 'flex',
};

const copyrightStyle = {
  padding: '2em',
  color: GRAY,
};

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = { width: window.innerWidth, height: window.innerHeight };
    this.resize = this.resize.bind(this);
  }
  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }
  resize() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }
  render() {
    let app = <App />;
    if (!isElectron() &&
        this.state.width > 800 && this.state.height > 500) {
      app = (<div style={flexColumStyle}>
        <SocialIcons />
        <div style={appContainerStyle}>{app}</div>
        <Copyright />
      </div>);
    }
    return <div style={layoutStyle}>{app}</div>;
  }
}

function SocialIcons() {
  return (<div style={headerStyle}>
    <a href="http://naivesound.com/">about</a>&nbsp;~&nbsp;
    <a href="http://twitter.com/naive_sound">follow</a>&nbsp;~&nbsp;
    <a href="https://github.com/naivesound/glitch">github</a>
  </div>);
}

function Copyright() {
  return (<div style={copyrightStyle}>
    Made with&nbsp;
    <i className="fa fa-heart" style={{ color: PINK }}></i>
    &nbsp;at&nbsp;
    <a href="http://naivesound.com/">NaiveSound</a>
  </div>);
}
