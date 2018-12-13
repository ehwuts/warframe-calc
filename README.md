# Warframe Calculator
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3810dc416c99410b90302f29d3d35b6f)](https://www.codacy.com/app/ehwuts/warframe-calc?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ehwuts/warframe-calc&amp;utm_campaign=Badge_Grade)
## Usage
Hopefully intuitive given knowledge of use of the source material.

## Local Setup
1. Due to standard XSS security, using a local copy of this project requires hosting a web server to request from.
2. It may additionally be required to run the util script to generate combined data files.

## Goals
The goal of this project is to produce a fully featured weapon calculator for Warframe.

### Goal Features:
1. Fully clientside logic with static data modules. 
   * Leaning async json to load weapon/enemy stats, trading increased file requests for reduced standing memory?
3. Display actual, with "Effective" unmerged.
4. Display Single shot/Burst/Sustained DPS
   * merged and per-type
5. Built in support for drop-in localization. One of:
   * pregen endpoints from template
   * dynamically fill after page load

### Secondary Features:
1. Enemy Scaling Calculator
2. Per-mod value calcs
3. Condition damage calcs sufficiently accurate as to be meaningful.
4. Damage effectiveness for enemy resource combinations
5. Tileset-based enemy spreads for #4

### Undecided:
1. Display as per ingame.
2. Import from WFB
	
## LICENSING
This project is licensed under the Unlicense. A copy of the Unlicense is saved here as LICENSE.

## DISCLAIMER
Digital Extreme Ltd, Warframe and the logo Warframe are registered trademarks. All rights are reserved worldwide. This project has no official link with Digital Extremes Ltd or Warframe. All artwork, screenshots, characters or other recognizable features of the intellectual property relating to these trademarks are likewise the intellectual property of Digital Extreme Ltd.
