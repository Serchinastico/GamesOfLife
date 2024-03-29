# Games of life

My playground for the different games of life, in the lookout for cool generative art.

## Elementary Automata

This is entirely based on [Wolfram's Elementary Cellular Automatons](https://mathworld.wolfram.com/ElementaryCellularAutomaton.html).

## Life Automata

Variations of [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway's_Game_of_Life).

### Rorschach

I made a happy accident and swapped x and y while calculating neighbors for a given cell. The result is a mirrored animation that resembles Rorschach tests.

### RGB Enemies

I'm trying to emulate 3 rival civilizations that will fight for territory

### WebGL

I decided to make the calculations more efficient and decided to use WebGL for that. With this approach (and after re-learning the basics of GLSL and OpenGL primitives) I created a world of simulations, each testing a different Game of Life configuration (by varying the values to decide if a cell borns or survives).

Some interesting configurations I liked:

- b5/s210 - Two groups, horizontals and verticals, fighting for territory
- b26/s69 - Similar to the above but it has more active battles
- b209/s51 - Borders are kind of a black mass that surround the cells
- b209/s240 - Interesting black borders but thicker
- b113/s85 - It dies slowly but forms patterns in the process that are quite a thing
- b254/s109 - It's static but the patterns it creates inside are very square-ish and beautiful
- b224/s181 - Again an static pattern but this time it looks in equilibrium between the dark and clear patterns

I now realised that some of these might have more bits than necessary. Because we first test for born status and then for survive status, born bits have priority over survival ones, hence, some survival bits can be removed.

## Ideas

- Use blender for better renders
- Mix colors in game of life
- Use more neighbors in game of life - different _neighboring_ definition (circular, 3D, symmetries)
- WebGL to make automata more efficient
- Use HashLife to make automata more efficient
- Leave traces

## Worklog

- I have a working WebGL implementation where I can change the born/survival rules so I want to give it some depth
- I'm going to start by coloring columns/rows (depending on neighbors)
- I want to try something different: weighting positions so that I can maybe push red from top-left corner and green from bottom-right corner
- Some interesting patterns when I set all weights to red weight: b61/s64
