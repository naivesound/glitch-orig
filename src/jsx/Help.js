import React from 'react';
import { connect } from 'react-redux';

import { YELLOW } from '../colors';

import * as actions from '../actions';

import * as functions from '../glitchFuncs';
import * as samples from '../glitchSamples';

const helpWrapperStyle = {
  overflowY: 'auto',
  flex: 1,
};
const helpStyle = {
  color: YELLOW,
  paddingTop: '1rem',
};

const HELP = `
Glitch is an algorithmic synthesizer. It creates music with math.

# INPUT AND OUTPUT

Music is a function __f(t)__ where __t__ is increasing in time.

Glitch increases __t__ at __8000/sec__ rate and it can be a real number if your
hardware sample rate is higher. Expression result is expected to be in range
__[0..255]__ otherwise overflow occurs.

Example: [t*14](#) - sawtooth wave at 437 Hz.

Music expression is evaluated once for each audio frame. You can use numbers,
math operators, variables and functions to compose more complex expressions.

# MATH

Basic: __+__ __-__ __*__ __/__ __%__ _(modulo)_ __**__ _(power)_

Bitwise: __&__ __|__ __^__ _(xor or bitwise not)_ __<<__ __>>__

Compare: __== != < <= > >=__ _(return 1 or 0)_

Grouping: __( ) ,__ _(separates expressions or function arguments)_

Conditional: __&&__ __||__ _(short-circuit operators)_

Assignment: __=__ _(left side must be a variable)_

Bitwise operators truncate numbers to integer values.

Example: [x=6,(y=x+1,x*y)](#) - returns 42

Example: [t*5&(t>>7)|t*3&(t*4>>10)](#) - bytebeat music

# FUNCTIONS

__l(x)__: log2(x)

__r(n)__: random number in the range [0..n]

__s(i)__: sine wave amplitude [0..255] at phase i=[0..255]

Example: [s(t*14)](#) - sine wave at 437Hz

# SEQUENCERS

Sequencers are used to describe melodies, rhythmic patterns or other parts of
your song.

__a(i, x0, x1, x2, ...)__ returns x[i] value for the given i

Example: [t*a(t>>11,4,5,6)](#)

__seq(bpm, x0, x1, x2, ...)__ returns x[i] value where i increases at given tempo.

Values can be numeric constants, variables or expressions. Values are evaluated
once per beat and the result is cached.

Value can be a pair of numbers like (2,3) then the first number is relative
step duration and the second one is actual value. This means value 3 will be
returned for 2 beats.

Value can be a group of more than 2 numbers. The the first number is relative
step duration, and other values are gradually slided, e.g. (0.5,2,4,2) is a
value changed from 2 to 4 back to 2 and the step duration is half of a beat.

Example: [t*seq(120,4,5,6)](#)

Example: [t*seq(120,(1,4,6,4),(1/2,5),(1/2,6))](#)

__loop(bpm, x0, x1, x2, ...)__ evaluates x[i] increasing i at given tempo.
Unlike seq, loop evaluates x[i] for every audio frame, so other functions can
be used as loop values.

seq is often used to change pitch or volume, loop is often used to schedule inner sequences/loops.

Example: [t*loop(30,seq(240,4,5),seq(240,4,6))](#)

seq and loop return NaN at the beginning of each step. NaN value is used by the
instruments to detect the start of a new note.

# INSTRUMENTS

Oscillators are the building blocks of synthesizers. Oscillator phase is
managed internally, only frequency must be provided (in Hz).

__sin(freq)__ = sine wave

__tri(freq)__ = triangular wave

__saw(freq)__ = saw-tooth wave

__sqr(freq, pwm)__ = square wave of given pulse width, default pwm=0.5

Example: [(sin(220)+tri(440))/2](#)

More advanced instruments:

__fm(freq, mf1, ma1, mf2, ma2, mf3, ma3)__ is a 3-operator FM synthesizer, mf
is operator frequency ratio, ma operator amplification. M2 and M1 are
sequential, M3 is parallel.

Example: [fm(seq(120,440,494),1,2,0.5,0.5)](#)

__tr808(instr, volume)__ is TR808 drum kit. 0 = kick, 1 = snare, 2 = tom, 3 =
crash, 4 = rimshot, 5 = clap, 6 = cowbell, 7 = open hat, 8 = closed hat.

Example: [tr808(1,seq(240,1,0.2))](#) plays simple snare rhythm

__env(r, x)__ wraps signal x with very short attack and given release time r

__env(a, r, x)__ wraps signal x with given attack and release time

__env(a, i1, a1, i2, a2, ..., x)__ wraps signal x with given attack time and
amplitude values for each time interval i.

Example: [env(0.001,0.1,sin(seq(480,440)))](#)

# MELODY

__hz(note)__ returns note frequency

__scale(i, mode)__ returns node at position i in the given scale.

Example: [tri(hz(scale(seq(480,r(5)))))](#) plays random notes from the major scale

# POLYPHONY

__mix(v1, v2, ...)__ mixes voices to avoid overflow.

Voice can be a single value or a pair of (volume,voice) values. Volume must be in the range [0..1].

Example: [mix((0.1,sin(440)),(0.2,tri(220)))](#)

# EFFECTS

__lpf(signal, cutoff)__ low-pass filter

# VARIABLES

Any word can be a variable name if there is no function with such name.
Variables keep their values between evaluations.

__t__ is time, increased from 0 to infinity by 8000 for each second.

__x__ and __y__ are current mouse cursor position in the range [0..1].

__bpm__ (if set) applies user input on the next beat to keep the tempo.

# LIST OF ALL FUNCTIONS

`;

function allFuncs() {
  return Object.keys(Object.assign({}, functions, samples, window.userFuncs || {}))
    .sort().join(' ');
}

function unescape(s) {
  const e = document.createElement('div');
  e.innerHTML = s;
  return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
}

function mmd(src) {
  let h = '';
  function escape(t) { return new Option(t).innerHTML; }
  function inlineEscape(s) {
    return escape(s)
      .replace(/\[([^\]]+)]\(([^(]+)\)/g, '$1'.link('$2'))
      .replace(/__([^_]*)__/g, '<strong>$1</strong>')
      .replace(/_([^_]+)_/g, '<em>$1</em>');
  }

  src
  .replace(/^\s+|\r|\s+$/g, '')
  .replace(/\t/g, '    ')
  .split(/\n\n+/)
  .forEach((b) => {
    const c = b[0];
    if (c === '#') {
      const i = b.indexOf(' ');
      h += `<h${i}>${inlineEscape(b.slice(i + 1))}</h${i}>`;
    } else if (c === '<') {
      h += b;
    } else {
      h += `<p>${inlineEscape(b)}</p>`;
    }
  });
  return h;
}

export default connect()((props) =>
  (<div
    className="help"
    style={helpWrapperStyle}
    ref={(el) => {
      if (el) {
        const links = el.querySelectorAll('a');
        for (let i = 0; i < links.length; i++) {
          const a = links[i];
          a.onclick = (e) => {
            e.preventDefault();
            props.dispatch(actions.setExpr(unescape(a.innerHTML)));
            props.dispatch(actions.play());
          };
        }
      }
    }}
  >
    <div style={helpStyle} dangerouslySetInnerHTML={{ __html: mmd(HELP + allFuncs()) }} />
  </div>));
