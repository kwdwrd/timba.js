# timba.js
Timba.js is a full-featured Javascript file to give your page that singular Timba polish.

## Eh, World!
Obtaining authentic production value is straightforward by design. The following script will randomly polish your page content at intervals between 0 and 15 seconds.

```
<script src="https://kwdwrd.github.io/timba.js/src/timba.js"></script>
<script language="javascript">
  Timbaland.installWhenPossible( Timbaland.ambient( { min_delay: 0, max_delay: 15000 }) );
</script>
```

## Limitations
Browser audio contexts are not available until page interaction. Your webpage will not be fully produced until the user interacts with the page. This is the role of `Timbaland.installWhenPossible`.

### Known limitations and pitfalls
* Timba's scheduler is indexed from loop start. For example, if your loop takes 10 seconds to play and is scheduled to play every 5 seconds, your loops will overlap (by 5 seconds).
* Timba's loop installation is accretive, and canceling loop play (via `Timbaland.cancel()`) does _not_ prevent the loops from being subsequently uninstalled. To reinitialize the loop set, run `Timbalanad.repeaters = []`.

# Usage

## Core concepts
`Timbaland` hosts a set of scheduled `loop`s. A `loop` is defined by its tempo, and consists of a (possibly degenerate) sequence of `beat`s, `rest`s, and `harmony`s. `beat`s and `harmony`s take zero time and are spaced by `rest`s. A `beat` is define by `detune` (its pitch) and `volume` (its volume). A harmony is simply a set of `beat`s played simultaneously.

## Examples

### Classic Timba
```
Timbaland.installWhenPossible( Timbaland.ambient() );
```

### Deterministic Timba
```
var beat = new Timbaland.beat( { detune: 100 } );

Timbaland.installWhenPossible( Timbaland.schedule( beat, 2000 ) );
```

### It's too late...
```
var apologize = new Timbaland.loop( { tempo: 100 } );

apologize.addBeat();
apologize.addRest( 2 );
apologize.addBeat();
apologize.addRest( 1.25 );
apologize.addBeat( { detune: -200 } );

Timbaland.installWhenPossible( Timbaland.ambient( apologize, { min_delay: 2000, max_delay: 20000 } ) );
```

### Major chord in the key of Timba
```
var major_timba = new Timbaland.harmony( [ { detune: 0 }, { detune: 400 }, { detune: 700 } ] );

Timbaland.installWhenPossible( Timbaland.schedule( major_timba, 2000 ) );
```

### Sadie's first Gymnopedie
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

Timbaland.installWhenPossible( Timbaland.schedule( gymnopedie, 5000 ) );
```

### End it all
```
Timbaland.cancel()
```
