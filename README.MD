Elevator Game
=============

The Goal
--------
Teach efficiency in programming to computer science students via an elevator control program. The players try to carry as many passangers as possible to their destination without accidents or passanger frustration.

Current state
-------------
Most of the backbone of the concept has been built. A controllable elevator element and most of the floor's process logic are done. Once people flow control is done, we can concentrate on the game and playability itself.

TODO
----

- [x] A programmable elevator with proper controls.
	- [x] Attach elevator to existing floors.
	- [x] Move elevator up.
	- [x] Move elevator down.
	- [x] Open doors.
	- [x] Close door.
- [x] Elevator graphics & animations.
	- [x] Elevator doors exist / are drawn properly.
	- [x] Elevator doors open and close.
	- [x] Elevator moves as intended.
- [ ] Disallow / punish for certain cases
	- [x] The elevator should not move to a direction without a floor.
	- [x] The elevator should not move if the doors are open.
	- [ ] Doors should not open while the elevator is moving.
- [ ] Floors and floor graphics.
	- [x] Floor initialization (placement, graphics, height..).
	- [x] Elevator positioning.
	- [x] First floor+doors graphic for testing.
	- [x] Possibility to change each floor's height and graphics.
	- [ ] Floor doors exist / are drawn properly.
	- [ ] Floor doors open and close.
- [ ] Interactable elevator action events.
- [ ] A rudimentary ElevatorIDE.
    - [ ] Code editor.
    - [ ] Console.
    - [ ] Elevator API + docs.
- [ ] People handler (Draw passangers from a given random distribution).
- [ ] Proper elevator music.
- [ ] Sound effects.
- [ ] Levels.
- [ ] Menus & options

Licence
-------
MIT licence.
