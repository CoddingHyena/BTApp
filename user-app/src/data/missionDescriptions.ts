/**
 * Описания миссий
 * Ключи должны точно соответствовать названиям миссий, возвращаемым с бэкенда
 */
export const missionDescriptions: Record<string, string> = {
  'Ambush': `Intel assures you that the way is clear.
Complications: One roll; reroll a result of Random Duration.
The Attacker automatically wins Initiative on the first 2 turns.
Duration: Unlimited.
Setup: Roll off to choose maps as normal. The losing player then chooses their home edge, and is the Defender, deploying via that edge normally.
The other player (the one that chose the maps) is the Attacker.
The Attacker must divide their force members into two even groups (if the two groups would be uneven, the Attacker can choose which side to place their one excess force member).
The Attacker does not use the standard remaining long edge as their home edge, but instead uses both short edges as home edges, deploying one of their groups per side edge. Alternatively, the Attacker can also deploy one of their groups via either the Hidden Forces or, if that group is solely made up of 'Mechs, the Combat Drop rules. Only one of these two special rules can be chosen.
Objective Tokens: None.
Victory Conditions: The last side with a non-crippled force member left is the victor.`,

  'Annihilation': `Each side is determined to fight to the last.
Complications: One roll; reroll a result of Random Duration.
Then roll 1D6: on a 6, apply an additional complication (reroll a duplicate or Random Duration).
Duration: Unlimited.
Setup: Standard.
Objective Tokens: None.
Victory Conditions: The last side with a non-crippled force member left is the victor.`,

  'Breakthrough': `Each side seeks to smash through the enemy lines to reach the vulnerable logistic areas beyond.
Complications: One roll; reroll a result of Random Duration.
Duration: 8 turns.
Setup: Standard.
Objective Tokens: None.
Victory Conditions: Unit Victory Points. In addition, if a force member moves or is moved off their opponent's home edge (not their own) on Turn 6 or later, remove that force member from the game. Its controller scores its Unit Victory Point value.`,

  'Control the Field': `Domination of as much of the battlefield as possible is the key.
Complications: One roll.
Duration: 8 turns (unless Random Duration is in effect).
Setup: Standard.
Objective Tokens: Before play begins, each side places three objective tokens exactly six hexes in from their home edge (e.g. 0106, 0112). Each token on a side must also be from 8-12 hexes away from any other friendly token.
As the objectives are abstract points on the battlefield rather than items of some sort, do not use objective variants.
Roll once to determine the control radius for all tokens: 1-2 = 0 hexes, 3-5 = 1 hex, 6 = 2 hexes.
Victory Conditions: If a side controls both any one friendly and any one enemy objective token, it gains 1 Victory Point in the End Phase of that turn. This is cumulative, up to 3 VP per turn for control of all six tokens.`,

  'Extraction': `A smaller force must be rescued from its attackers before it is crushed.
Complications: One roll.
Duration: 8 turns (unless Random Duration is in effect).
Setup: The side that chooses their home edge is always the Defender. The other player is always the Attacker.
The Defender divides their force in half. The Attacker chooses one of these halves. The Defender places the chosen half in any legal hexes within two hexes of Hex 1508 (with two separate mapsheets, use the instance of 1508 on the left mapsheet). Each force member can only be placed in a hex/level it can legally enter from a hex on the battlefield using its available movement modes and MP. If the Defender has more units available than there are hexes to deploy in, the Defender can use adjacent hexes after filling their initial deployment area.
The remainder of the Defender's force moves onto the board from the Defender's home edge on Turn 1 as normal. For the Defender, the Knife-Fight complication only affects the deployment of the half of the force deploying from their home edge.
The Attacker deploys as normal. If using Battlefield Support, the Attacker cannot place pre-plotted hexes, emplacements, or minefields within two hexes of Hex 1508. If the Attacker has Emplacements, these cannot be deployed, but are automatically converted into Unit VPs for the Attacker.
Objective Tokens: None.
Victory Conditions: Unit Victory Points.`,

  'Focal Point': `The battlefield has a central position that must be seized at all costs.
Complications: One roll.
Duration: 8 turns (unless Random Duration is in effect).
Setup: Standard.
Objective Tokens: Before play begins, place one objective token on Hex 1508 (with two separate mapsheets, use the instance of 1508 on the left mapsheet).
As the objective is a point on the battlefield rather than an item of some sort, do not use objective variants.
The control radius of this token is 2 hexes.
Victory Conditions: The token's controller receives 3 Victory Points in the End Phase of a turn.`,

  'General Melee': `We now join the battle, already in progress.
Complications: Fog of War is in use, with the Thicker Fog variant. Then roll 1D6 to see which additional complication is in use: 1-2 = Battlefield Conditions; 3-4 = Edge, 5-6 = Edge: Commanders.
Duration: 8 turns.
Setup: Each side deploys as normal, but must deploy each force member a minimum of 6 hexes and a maximum of 7 hexes from their home edge (i.e. the -07 and -08 hexrows on one side, and the -11 and -12 hexrows on the other).
Objective Tokens: None.
Victory Conditions: Unit Victory Points.`,

  'Hold the Line': `The defender must hold their general position against an enemy onslaught.
Complications: One roll.
Duration: 8 turns (unless Random Duration is in effect).
Setup: Standard; however, after each side has determined their home edge, roll off to see which side is the Defender.
Objective Tokens: Before play begins, the Defender places three objective tokens exactly seven hexes in from their home edge (e.g. 0107, 0114). Each token on a side must also be from 8-12 hexes away from any other friendly token.
As the objectives are points on the battlefield rather than items of some sort, do not use objective variants.
Roll once to determine the control radius (see p. 14) of all tokens: 1-2 = 0 hexes, 3-5 = 1 hex, 6 = 2 hexes.
Victory Conditions: If a side controls two of the three objective tokens at the game's end, they win. If neither side controls two objective tokens at the game's end, the game is a draw.`,

  'Objective Raid': `Your warbook doesn't have an entry describing what a "MacGuffin" is, but your orders to retrieve it are clear.
Complications: One roll.
Duration: 8 turns (unless Random Duration is in effect).
Setup: Standard.
Objective Tokens: Before play begins, one side rolls 1D6+6 (i.e. a range of 7-12). This is the number of objective tokens placed on the board. Sides alternate placing one of these at a time, starting with the player that chose their home edge first. Each token can be placed anywhere that is seven or more hexes from that side's home edge, and at a minimum of three hexes from any other token.
Roll once to determine the control radius of all tokens: 1-3 = 0 hexes, 4-6 = 1 hex.
In addition, a player rolls 1D6 to determine the objective variant for all tokens in play: 1 = False, 2-3 = Fragile, 4-5 = Mobile, 6 = roll twice, continuing to do so until two different results are determined and ignoring further results of 6; apply both results.
Victory Conditions: At the end of the game, a token's controller receives 1 Victory Point (unless that objective is a False Objective).`,

  'Recon': `Both sides are seeking fresh sensor readouts to counter the enemy's deployment of new units and fire control systems.
Complications: One roll.
Duration: 8 turns (unless Random Duration is in effect).
Setup: Standard.
Objective Tokens: None.
Victory Conditions: In this mission, enemy units can be scanned (see Scanning). Keep track of the number of units that a given force member has scanned.
If a force member has scanned at least one enemy unit, that force member can leave the board via its home edge. If it does, its controlling side receives 1 Victory Point for each enemy unit that it scanned. Multiple force members can scan the same enemy unit and all of them generate their own VPs for this. A unit cannot be scanned if it is immobile.
Ground Assets can scan if they have the PRB Special as normal, but no Asset is a valid scan target for this mission.`,

  'Steel Rain': `A profitable looting operation is rudely interrupted by reinforcements from an unexpected direction.
Complications: One roll.
Duration: 8 turns (unless Random Duration is in effect).
Setup: Determine maps as normal. Then roll off to see which side is the Attacker.
The Attacker uses standard deployment. The Defender's entire force will use the Combat Drop rules to deploy: half of their force members on Turn 1 (round up), and half on Turn 2.
The Defender places the mission objective tokens (see below).
Lastly, the Attacker selects their home edge.
Objective Tokens: The Defender places five Mobile Objective tokens with a control radius of 0. Each must be at least 5 hexes from any other objective, and at least 5 hexes from any home edge.
Victory Conditions: At the end of the game, the Attacker gains 1 Victory Point for each objective currently held by one of their units, and 1 VP for each unit carrying an objective that has left the map via their home edge. If the Attacker scores 3 or more VP, they win.`,

  'Urban Sweep': `Somewhere in this dump is the intel everyone wants.
Complications: One roll.
Duration: 8 turns (unless Random Duration is in effect).
Setup: Roll off to see which side determines the mapsheets to use. If the mapsheets selected do not have at least six buildings (more is better), at least six building tokens must be available.
The mission uses six objective tokens. The player that did not select the mapsheets places the first token, and token placement alternates one at a time (see below).
Roll off to see who chooses their home edge first.
Objective Tokens: Before choosing home edges, six objective tokens are placed, each in a separate building hex at least four hexes from any home edge (if there are no such buildings on the map, a building token is placed at the same time in the same hex as the objective token). Each token is inside its building at its ground level, not on its roof.
Victory Conditions: Each side can scan objective tokens as normal (see Scanning, p. 15), so long as the building the token is in has not collapsed.
For each successful scan, that player rolls 1D6: on a result of a 4+, that scan has uncovered mission-critical intel worth 2 Victory Points (this result can be rerolled using Edge). Multiple scans by separate force members can be made of the same objective in the same End Phase, including scans by both sides, and the VP from this can be claimed multiple times in the same End Phase and by multiple sides.
However, once a token has been revealed to have mission-critical intel, that token is removed from play at the start of the next turn.
If a building collapses onto an objective, the token in that building is removed and the side that triggered the collapse (regardless of who did what damage prior to that point) loses 2 VP.
This can result in a player having negative VP.`,
};

