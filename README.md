# The Original Glitch

This is the original Glitch, a minimal synthesizer and composer for algorithmic music. It's been fully written in ES6 + React, including the expression evaluation engine. The performance became a problem, on an average PC one can't code a song of more than ~20-30 lines of Gltich code.

That's why Glitch has been rewritten.

## The latest Glitch

The new (and the only active) Glitch is available at https://github.com/naivesound/glitch and a live web app is at http://naivesound.com/glitch

Original web version of Glitch is still available at http://naivesound.com/glitch-orig if you want to compare.

## Reference

Operators:

- + - * / % \*\* ( )
- &lt;&lt; &gt;&gt; | &amp; ^
- &lt; &gt; &lt;= &gt;= == != &amp;&amp; ||
- `=`
- `,`

Sequencers:

- loop(bpm, ...)
- seq(bpm, ...)
- a(index, ...)

Instruments:

- sin(hz)
- tri(hz)
- saw(hz)
- sqr(hz, [width])
- fm(hz, [m1, a1, m2, a2, m3, a3])

Effects:

- env(releaseTime, x)
- env(attackTime, [interval, gain]..., x)
- lpf(x, frequency)
- mix(...)

Utils:

- scale(index, mode)
- hz(note)
- r(max)
- l(x)
- s(phase)
