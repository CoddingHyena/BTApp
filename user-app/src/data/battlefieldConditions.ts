/**
 * Описания условий поля боя
 * Ключи должны точно соответствовать названиям условий, возвращаемым с бэкенда
 */
export const battlefieldConditions: Record<string, string> = {
  'Edge': `In a mission using Edge, each side receives 3 Edge points. Edge points represent luck, and a player can spend one point for any of the following effects: % Accuracy Increase: After an attack has been rolled, add 1 to that attack roll (i.e., potentially changing a miss to a hit). % Cluster Increase: After a roll on the Cluster Hits Table, reroll and use the highest result. % Damage Increase: After a roll on the Determining Critical Hits Table, reroll and use the highest result. % Scan Improvement: After a Scanning roll (see p. 15), reroll the result.
In addition, individual missions might include uses of Edge specific to that mission.
A player can spend only one Edge point per applicable situation, regardless of the number of different sources of Edge. In a game with three or more sides, a side can spend points to benefit a side not their own.
Edge available to each side is best tracked with a pool of tokens visible to all.
Alternate Versions: Other products provide different uses for Edge. With all players' agreement, these uses can be added to the Standard Mission uses above.
Scaled Increase: For every level of Scale past 3, add 1 to the number of Edge points available per side.`,

  'Edge: Commanders': `In a mission using Edge, the mission can employ commanders if all players agree or if the mission specifies this. Each side selects one of their units to become their command unit. This status must be indicated on the unit's record sheet and is public knowledge.
Assets can only be made commanders if no units exist on that side to be nominated.
When commanders are in use, a mission does not use a preset amount of Edge. Instead, at any time during a turn, a commander can apply 1 point of Edge to any one friendly force member (including itself) within six hexes that it has line of sight to.
Scaled Increase: At Scale levels 1–3, a side has one commander.
For every three levels of Scale past this range (e.g. 4–6, 7–9, 10–12, etc.), each side nominates one separate, additional commander.`,

  'Fog of War': `In a mission using Fog of War, deployment is concealed. As usual, both sides know the composition of the other's force and can still consult any record sheets, but when a side deploys their force, they deploy markers in place of their units and ground Assets.
Each marker represents one specific force member: this is hidden information (see p. 10).
Once all deployment is complete, any concealed sides reveal which marker corresponds to which force member, and replaces all markers with their matching force members.

VARIANT: THICKER FOG
When using this variant, in addition to the concealed side's normal markers, they receive one additional marker per level of Scale, which are deployed as if they were force members. These markers do not correspond to any actual force member: such "blip counters" represent false sensor readings or faulty intelligence, and are recorded by their controller as such. When a side reveals their markers and deploys their force, their blip counters are discarded.
ACTIVE PROBES
For each active probe on a side, some markers in the enemy force are revealed before their placement. The enemy player chooses which of their markers are revealed by opposing probes; they may reveal a Thicker Fog blip counter, if they have any, instead of revealing an actual force member. Revealed force members are placed as normal, instead of as markers.
The number of enemy markers revealed per active probe is based on the probe's type (or equivalent). All effects are cumulative: Light Active Probe or PRB Special: 1 marker Active Probe: 2 markers Bloodhound Active Probe: 3 markers`,

  'Knife-Fight': `Both forces must deploy four hexes in from their home map edges, with their first hex moved into being the fifth (e.g., instead of treating hex 0101 as the first hex, treat 0105 as such).
While a Knife-Fight moves each player's deployment forward, their home edge remains the actual edge of the battlefield. As such, moving off the battlefield still requires reaching the edge of the map, just as with a standard deployment.`,

  'Random Duration': `In a mission using Random Duration, after the End Phase of Turn 6, one player must roll 1D6. On a roll of 2+, the game continues; otherwise the game is over. After the End Phase of Turns 7 and 8, any player must roll 1D6 again. This time the game continues on a roll of 3+; otherwise the game is over. After the End Phase of Turn 9, any player must roll 1D6 again: the game only continues on a roll of 5+. Continue rolling in the End Phase once per turn until the game ends.`,

  'Battlefield Conditions': `НЕТ ОПИСАНИЯ`,
};

