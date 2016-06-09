import React from 'react'
import ReactDOM from 'react-dom'

import { connect } from 'react-redux'

import { tab } from '../reducers'

import {YELLOW, GRAY, WHITE, PINK} from '../colors'

import Visualizer from './Visualizer'
import Toolbar from './Toolbar'
import Editor from './Editor'
import Library from './Library'
import Help from './Help'

const appContainerStyle = {
  display: 'flex',
  width: '100%',
  minHeight: '100%',
  maxHeight: '100vh',
  flex: 1,
  backgroundColor: GRAY,
}

const headerStyle = {
  display: 'flex',
  height: '72px',
  lineHeight:'72px',
  fontSize: '18pt'
}

const titleStyle = {
  color: YELLOW,
  fontWeight: 600,
}

const errorIconStyle = {
  color: PINK,
  fontSize: '20pt',
  height: '72px',
  width: '72px',
  lineHeight: '72px',
  textAlign: 'center',
}

const mainSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  padding: '0 0 0 1em',
}

class App extends React.Component {
  render() {
    return <div style={appContainerStyle}>
      <MainSection tab={this.props.navigation.tab} error={this.props.error} />
      <Toolbar />
    </div>
  }
}

class MainSection extends React.Component {
  render() {
    var content
    switch (this.props.tab) {
      case tab.EDITOR: content = <Editor />; break
      case tab.LIBRARY: content = <Library />; break
      case tab.HELP: content = <Help />; break
    }
    return <div style={mainSectionStyle}>
      <Header error={this.props.error} />
      {content}
    </div>
  }
}


class Header extends React.Component {
  render() {
    return <div style={headerStyle}>
      <Title />
      <ErrorIcon error={this.props.error} />
      <Visualizer />
    </div>
  }
}

class Title extends React.Component {
  render() {
    return <div style={titleStyle}>
      #glitch
    </div>
  }
}

class ErrorIcon extends React.Component {
  render() {
    var visibility = {visibility: (this.props.error ? 'visible' : 'hidden')};
    return <i className="fa fa-exclamation-triangle" style={Object.assign(errorIconStyle, visibility)}></i>
  }
}

class IconButton extends React.Component {
  render() {
    return <div {...this.props}
      style={{
	height: '72px', lineHeight: '72px', textAlign: 'center', cursor: 'pointer',
	fontSize: '20pt',
	opacity: (this.props.active ? '1' : '0.4'),
      }}>
      <i className={"fa " + this.props.icon} style={{color: this.props.color}}></i>
  </div>
  }
}

function mapStateToProps(state) {
  return {navigation: state.navigation, error: state.expr.error}
}

export default connect(mapStateToProps)(App)
