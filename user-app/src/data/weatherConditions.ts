/**
 * Описания погодных условий
 * Ключи должны соответствовать базовым названиям условий (без уровней и скобок)
 */
export const weatherConditions: Record<string, string> = {
  'Extreme Cold': `For every level of Extreme Cold present, the 'Mech dissipates an additional 3 heat points per turn. For example, if the mission applies the effects of Extreme Cold (3), the 'Mech dissipates an additional 9 heat points per turn.
In addition, with any level of Extreme Cold in effect, all water hexes become ice hexes (see p. 19).
Assets: All Asset types ignore the Extreme Cold rules.
Life Support: Because a 'Mech tends to flood its cockpit with internal heat, extreme cold can be less dangerous to an exposed MechWarrior than extreme heat. A 'Mech that has taken a life support critical hit ignores the normal Damage to MechWarriors rule (see p. XX) that assigns MechWarrior hits due to heat. Instead, during the Heat Phase of each turn, apply one MechWarrior hit per Extreme Cold level in effect.
However, if in the Heat Phase the 'Mech's heat scale was 5 to 10 points after normal dissipation is applied, the first such hit that would have been applied that phase is negated. If the 'Mech's heat scale was from 11-20 points, two such hits are negated. If the 'Mech's heat scale was 21+ points, three such hits are negated.
The above Life Support rules do not apply to a 'Mech with a torso-mounted cockpit. Such 'Mechs use the normal life support damage rules for that cockpit type.`,

  'Extreme Heat': `For every level of Extreme Heat present, the 'Mech generates an additional 3 heat points per turn. For example, if the mission applies the effects of Extreme Heat (3), the 'Mech generates an additional 9 heat points per turn.
In addition, if any level of Extreme Heat is in effect, all water hexes have their water removed, and any hex with a Depth becomes a sublevel instead (see p. XX). For example, all Depth 2 water hexes become Sublevel 2 sinkholes.
Assets: All Asset types ignore the Extreme Heat rules.
Life Support: For each Extreme Heat level in effect, a 'Mech that has taken a life support critical hit applies one additional MechWarrior hit each time that the 'Mech's internal heat scale reaches a point capable of damaging the MechWarrior.
For example, a 'Mech with a life support hit normally deals one hit to its MechWarrior when the 'Mech's heat scale reaches 10-19. If the mission had Extreme Heat (2) in effect, that MechWarrior would instead take 3 hits (the standard one, plus two for the Extreme Heat level).`,

  'Gravity': `Some worlds have gravity that is significantly higher or lower than normal Terran gravity. Gravity is represented by a G-rating, with Terran gravity (1 G) being the baseline. While some BattleTech worlds have canonical gravity values, for ease of calculation mid- game, round to the nearest 0.1 value (e.g. 0.95 to 1.04 rounds to 1 and thus has no effect, while 1.05-1.14 rounds to 1.1, etc).
Note that zero-gravity rules are not covered here: a minimum of 0.1 G is assumed.
Building Collapse: Gravity also affects the damage done by collapsing buildings (see p. XX).
Falling: Calculate damage from the fall normally, then multiply the result by the mission G-rating to determine the final damage, rounding the result up.
To save time, it is suggested that each player calculate the gravity-modified damage for a 0-level fall at the start of the game for each 'Mech under their control, since that will be the base damage for all falls for that 'Mech for the entire game.
Jumping: If a world's gravity falls outside of Terran standard, each of a 'Mech's jumps require a PSR with a –1 modifier to represent the unfamiliar jump conditions, unless the mission states (or players agree) that a given MechWarrior is native to that world or has sufficiently trained on gravity of that level.`,

  'Low Visibility': `This covers vision obscurants that affect the whole battlefield: blizzards, fog, sandstorms, smog and the like (but not darkness, which is covered under Night, below). Such effects apply a flat +1 TN modifier to all ranged attacks, but have no effect on line of sight (a practical concession, to avoid such games becoming close-range slugfests). However, a 'Mech can make a Piloting Skill Roll at the start of the Ranged Attack Phase: success indicates that that 'Mech ignores the +1 low visibility TN modifier for that turn (failure does not cause a fall).
In general, no more than one instance of a Low Visibility condition should be applied to a single mission, as otherwise it`,

  'Night': `The vast majority of modern combat units have advanced low- light, heat-tracking, and other sensor equipment, so that most low- light environments are not notably impeding.
Assets: Unless they have the Night Special, conventional infantry cannot make attacks at long range, and cannot spot for indirect fire past their medium range.`,

  'Rain': `Cannot be used with Fire or Extreme Temperatures.
The Rain condition assumes a heavy rainfall that has already been in effect for some time. This applies the mud terrain modification (see p. 19) to every hex across the playing area, with the exception of water hexes of Depth 1+, pavement, standard roads, and building hexes.`,

  'Snowfall': `Cannot be used with Fire or Extreme Heat.
The Snowfall condition assumes a heavy snowfall that has already been in effect for some time. This applies the snow terrain modification (see p. 20) to every hex across the playing area, with the exception of water hexes of Depth 1+. 'Mechs do not benefit if inside a building hex, but do if on a roof.
It is not required to use Extreme Cold with Snowfall.`,

  'Wind': `Gale-force winds produce sudden and fierce wind shears that imbalance 'Mechs, especially those that are airborne.
Apply a +1 modifier to all PSRs made by 'Mechs not inside a building (a 'Mech on a roof is not inside a building), except for cases involving jumping, covered below.
Smoke and fog terrain modifications cannot exist on maps with the Wind condition, even if from fire hexes, smoke missiles, etc.
However, Low Visibility conditions (see p. 17) are still feasible with Wind, representing effects such as blizzards or sandstorms.
Assets: +1 MP cost per hex for Assets with the hover, jumping, and VTOL movement modes.
DFA: If resolving a Death From Above attack, add +1 to the PSR Target Number made after a successful DFA. If the attacker falls upon resolution of the DFA, add 1 to the levels fallen.
Jumping: A 'Mech that jumps in Wind (but is not making a DFA) must make a PSR with a +1 modifier upon landing. If it fails, the result is a 1-level fall rather than a 0-level fall. If making a DFA, instead apply a +1 modifier to any resulting PSR as normal.`,
};

