import * as expr from 'expr';
import * as functions from './glitchFuncs';
import * as samples from './glitchSamples';

export default class Glitch {
  constructor(sampleRate = 44100) {
    this.expr = () => 0;
    this.src = '';
    this.sampleRate = sampleRate;
    this.reset();
  }
  reset() {
    this.vars = {
      t: expr.varExpr(0),
      x: expr.varExpr(),
      y: expr.varExpr(0),
    };
    this.funcs = Object.assign({}, functions, samples)
    this.expr = expr.parse(this.src, this.vars, this.funcs);
    this.frame = 0;
    this.measure = 0;
  }
  compile(e) {
    const f = expr.parse(e, this.vars, this.funcs);
    if (f) {
      this.next = {src: e, expr: f};
      return true;
    }
    return false;
  }
  nextSample() {
    const v = this.expr();
    if (!isNaN(v)) {
      this.lastSample = (((v % 256) + 256) % 256) / 128 - 1;
    }
    this.frame++;
    let applyNext = true;
    const bpm = (this.vars.bpm ? this.vars.bpm() : 0);
    if (bpm) {
      applyNext = false;
      this.measure++;
      if (this.measure > this.sampleRate * 60 / bpm) {
        this.measure = 0;
        applyNext = true;
      }
    }
    if (applyNext && this.next) {
      this.expr = this.next.expr;
      this.src = this.next.src;
      this.next = undefined;
    }
    this.vars.t(Math.round(this.frame * 8000 / this.sampleRate));
    return this.lastSample;
  }
  onaudioprocess(e) {
    const buffer = e.outputBuffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = this.nextSample();
    }
  }
}
