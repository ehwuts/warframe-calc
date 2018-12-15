# TODO

## Base

-   Replace page layout with something decent.

-   Isolate component code so that changes are saner

-   Convert composite data files and loading to use compression.

-   Scripts to pregenerate and compress composite data files from raw/\*

    -   Warning generation for unlocalized terms per language.
    -   ~~Coverage for Weapons~~
    -   ~~Coverage for Mods~~
    -   Coverage for Warframes
    -   Coverage for Companions

## Calculator-Aux

-   Auras
-   Buffs

## Calculator-Weapons-Generic

-   Warning generation for unprocessed stats.

-   Status cleanup
    -   Output niceness
    -   Indirect effect descriptions
    -   ~~Effect damage~~
    -   Verify effect damage
    
-   ~~Rivens~~
    -   Clean up Riven code's mess
    
-   Make the mod filter actually filter

-   mod "value" comparisons

-   Flesh out the multiattack support

-   minimum activation damage

-   Data
    -   Primary Weapons - 0/110
    -   Primary Mods - 0/?
    -   Secondary Weapons - 0/95
    -   Secondary Mods - 0/?
    -   Melee Weapons - 0/138
    -   Melee Mods - 0/?
    -   Robotic Weapons - 0/16
    -   Arch-Gun - 0/9
    -   Arch-Melee - 0/8
    -   Zaw Modulation
    -   Kitgun Modulation
    -   ~~Riven stats~~

## Calculator-Guns

-   Charge shot specifics
    -   Charge Time versus Fire Rate
    
-   Verify base Pellet logic

-   Fire types support

-   Bow Specifics (?)

-   Sniper Specifics

    -   sniper combo
    -   ~~sniper zoom~~

-   Beam Specifics
    -   multishot doesn't add status chances?

## Calculator-Melee

-   Everything
-   Stances
-   Melee Combo

## Enemy Scaler

-   Everything
-   Remember to treat armor and health types as a single table internally so that certain enemies don't require specialcasing.
-   Cross reference to weapon output spread.

## FrameCalc

-   Decide to even add this featureset

-   Merge Auras

-   Disturbing amount of special-casing.

-   Data
    -   Warframes - 0/59
    -   Warframe Mods - 0/?
    -   Archwing - 0/5
    -   Arcanes

## CompanionCalc

-   Decide to even add this featureset

-   Disturbing amount of special-casing.

-   Data
    -   Companions - 0/22
    -   Companion Mods - 0/?
    -   Moa Modulation
