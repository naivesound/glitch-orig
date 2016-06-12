import b64bd from './samples/bd.wav';
import b64cb from './samples/cb.wav';
import b64cl from './samples/cl.wav';
import b64hh from './samples/hh.wav';
import b64mc from './samples/mc.wav';
import b64mt from './samples/mt.wav';
import b64oh from './samples/oh.wav';
import b64rs from './samples/rs.wav';
import b64sn from './samples/sn.wav';

const TR808Samples = [
  atob(b64bd),
  atob(b64cb),
  atob(b64cl),
  atob(b64hh),
  atob(b64mc),
  atob(b64mt),
  atob(b64oh),
  atob(b64rs),
  atob(b64sn),
];

function arg(x, defaultValue) {
  if (!x) {
    return defaultValue;
  }
  return x();
}

export function tr808(args) {
  this.i = this.i || 0;
  let drum = arg(args[0], NaN);
  let volume = arg(args[1], 1);
  if (!isNaN(drum) && !isNaN(volume)) {
    let sample = TR808Samples[((drum%TR808Samples.length)+TR808Samples.length)%TR808Samples.length];
    if (this.i * 2 + 0x80 + 1 < sample.length) {
      let hi = sample.charCodeAt(0x80 + this.i * 2+1);
      let lo = sample.charCodeAt(0x80 + this.i * 2);
      let sign = hi & (1 << 7);
      let v = (hi << 8) | lo;
      if (sign) {
        v = -v + 0x10000;
      }
      let x =  v / 0x7fff;
      this.i++;
      return x * volume * 127 + 128;
    } else {
      return NaN
    }
  }
  this.i = 0;
  return NaN
}

