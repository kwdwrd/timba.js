# timba.js
timba.js is a full-featured Javascript file to give your page that singular Timbaland polish.

## Eh, World!
Obtaining authentic production value is straightforward by design. The following script will randomly play "Eh" at intervals between 0 and 15 seconds.

```
<script src="https://kwdwrd.github.io/timba.js/src/timba.js"></script>
<script language="javascript">
  Timbaland.installWhenPossible( Timbaland.ambient() );
</script>
```

## Limitations
Browser audio contexts are not available until page interaction. Your webpage will not be fully produced until the user interacts with the page. This is the role of `Timbaland.installWhenPossible`.

### Known limitations and pitfalls
* Timba's scheduler is indexed from loop start. For example, if your loop takes 10 seconds to play and is scheduled to play every 5 seconds, your loops will overlap (by 5 seconds).
* Timba's loop installation is accretive, and canceling loop play (via `Timbaland.cancel()`) does _not_ prevent the loops from being subsequently uninstalled. To reinitialize the loop set, run `Timbalanad.repeaters = []`.

# Usage

## Core concepts
`Timbaland` hosts a set of scheduled `loop`s. A `loop` is defined by its tempo, and consists of a (possibly degenerate) sequence of `beat`s, `rest`s, and `harmony`s. `beat`s and `harmony`s take zero time and are spaced by `rest`s. A `beat` is defined by `detune` (its pitch relative to Eh440) and `volume` (its volume). A harmony is simply a set of `beat`s played simultaneously.

## Examples

### Classic Timba
```
Timbaland.ambient();
```

### Deterministic Timba
```
var beat = new Timbaland.beat( { detune: 100 } );

Timbaland.schedule( beat, 2000 );
```

### It's too late...
```
var apologize = new Timbaland.loop( { tempo: 100 } );

apologize.addBeat();
apologize.addRest( 2 );
apologize.addBeat();
apologize.addRest( 1.25 );
apologize.addBeat( { detune: -200 } );

Timbaland.ambient( apologize, { min_delay: 5000, max_delay: 10000 } );
```

### In the Alps
```
var echo = new Timbaland.loop( { tempo: 100 } );

echo.addBeat( { volume: 1.0 } );
echo.addRest( 2 );
echo.addBeat( { volume: 0.6 } );
echo.addRest( 2 );
echo.addBeat( { volume: 0.3 } );
echo.addRest( 2 );
echo.addBeat( { volume: 0.1 } );

Timbaland.schedule( echo, 8000 );
```

### Major chord in the key of Timba
```
var major_timba = new Timbaland.harmony( [ { detune: 0 }, { detune: 400 }, { detune: 700 } ] );

Timbaland.schedule( major_timba, 2000 );
```

### Satie's first Gymnopedie
```
var gymnopedie = new Timbaland.loop( { tempo: 80 } );

gymnopedie.addBeat( { detune: 0 } );
gymnopedie.addRest( 1 );
gymnopedie.addHarmony( [ { detune: 400 }, { detune: 700 }, { detune: 1100 } ] );
gymnopedie.addRest( 2 );
gymnopedie.addBeat( { detune: -700 } );
gymnopedie.addRest( 1 );
gymnopedie.addHarmony( [ { detune: 200 }, { detune: 600 }, { detune: 1100 } ] );
gymnopedie.addRest( 2 );

Timbaland.schedule( gymnopedie, 5000 );
```

### Sh-ehpard scales
```
var loop = new Timbaland.loop( { tempo: 100 } );

var rest = 0.5;
var tempo = loop.tempo;
var steps = 36;

for ( var i = 0; i < steps; ++i )
{
    loop.addHarmony( [
        { detune: -2400 + i * 1200 / steps, volume: ( i + 1 ) / steps },
        { detune: -1200 + i * 1200 / steps, volume: 1 },
        { detune: i * 1200 / steps, volume: 1 },
        { detune: 1200 + i * 1200 / steps, volume: ( steps - i ) / steps }
    ] );
    loop.addRest( rest );
}

Timbaland.schedule( loop, 600 * steps * rest / tempo );
```

### I found your number on the wall
```
var to_beat = ( hz ) => new Timbaland.beat( { detune: Math.log( hz / 1e3 ) / Math.log( 2 ) * 1200 } );
var to_dtmf = ( i ) => new Timbaland.harmony( [ high_tones[( i - 1 ) % 3], low_tones[Math.trunc( ( i - 1 ) / 3 )] ] );
var high_tones = [ 1209, 1336, 1477, 1633 ].map( ( hz ) => to_beat( hz ) );
var low_tones = [ 697, 770, 852, 941 ].map( ( hz ) => to_beat( hz ) );

var dtmf = [...Array( 9 ).keys()].map( ( i ) => to_dtmf( i + 1 ) );
dtmf.unshift( new Timbaland.harmony( [ high_tones[1], low_tones[3] ] ) );

var jenny = new Timbaland.loop( { tempo: 134 } );
jenny.addElement( dtmf[8] );
jenny.addRest( 1 );
jenny.addElement( dtmf[6] );
jenny.addRest( 1 );
jenny.addElement( dtmf[7] );
jenny.addRest( 1.75 );
jenny.addElement( dtmf[5] );
jenny.addRest( 1 );
jenny.addElement( dtmf[3] );
jenny.addRest( 1.45 );
jenny.addElement( dtmf[0] );
jenny.addRest( 1 );
jenny.addElement( dtmf[9] );

Timbaland.schedule( jenny, 6000 );
```

### End it all
```
Timbaland.cancel()
```
