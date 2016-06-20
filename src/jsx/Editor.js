import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';

import { GRAY, WHITE } from '../colors';

import { setExpr } from '../actions';

const editorStyle = {
  flex: '1',
  width: '100%',
  resize: 'none',
  fontSize: '18pt',
  border: 'none',
  outline: 'none',
  color: WHITE,
  backgroundColor: GRAY,
  fontFamily: 'Roboto Mono, monospace',
};

class Editor extends React.Component {
  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.editor).focus();
  }
  handleTextChange(e) {
    this.props.dispatch(setExpr(e.target.value));
  }
  render() {
    return (<textarea
      ref="editor"
      autoComplete="off"
      autoCorrect="off"
      autocapitalize="off"
      spellCheck={false}
      value={this.props.expr}
      onChange={(e) => this.handleTextChange(e)}
      style={editorStyle}
    />);
  }
}
Editor.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  expr: React.PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return { expr: state.expr.expr };
}

export default connect(mapStateToProps)(Editor);

