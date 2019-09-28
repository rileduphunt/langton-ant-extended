Extended Langton's Ant Cellular Automaton

CPSC 335-03, Project 01

Team RKH

Members: Riley Hunt

Intro:

The algorithm used is a straightforward implementation of Langton's Ant that immediately draws changed cells to the canvas.

Contents: cella.js, cella_page.html

Features:

[*] Adjustable speed settings through dropdown box

[*] Canvas size, grid size, and ruleset trivially adjustable (no function or user interface to change them yet though)

[*] Triangle to mark Ant's current position

[*] Visible counter for number of passes so far

[] Not implemented: Grid lines between cells

Bugs:

Stops executing on pass #42,817 due to reaching the edge of the canvas

In the event of World.Grid's values changing for reasons other than the ant, these changes will not become visible until the ant causes the square to be rerendered

Color scheme is garish

Ant hard to see on yellow tiles

Instructions: Open cella_page.html in any web browser
