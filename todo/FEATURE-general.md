# General Feature Wishlist

## Script Architecture

-   [ ] minimize code style issues
-   [ ] refactor logic to escape javascript's weird arbitrary execution vulnerabilities
-   [ ] factor logic into isolated modules as appropriate
-   [ ] mininimize pollution of global namespace

## Display

-   [ ] stats display matching ingame display
-   [ ] stats display that's actually correct
-   [ ] clean up the page layout to stop being terrible
-   [ ] error header for tidy display of notices and unexpected issues
-   [ ] header notices for unsupported stats

### Form Controls

-   [ ] form control for filtering mods in the list
-   [ ] form controls for conditional mod effects
-   [x] form controls for zoom effects
-   [x] form controls for riven editing
-   [x] form controls for language selection
-   [x] form controls for weapon selection
-   [ ] export build code for self
-   [ ] import build code from self
-   [ ] export build code for WFB
-   [ ] import build code from WFB
-   [ ] import riven code from samodeus
-   [ ] form controls for defining a ZAW
-   [ ] form controls for defining a MOA companion
-   [ ] form controls for defining a KITGUN
-   [ ] form controls for defining a custom weapon
-   [ ] form controls for changing which fire mode is being viewed

### Complex Display

-   [ ] per-shot
-   [ ] "minimum" per-shot damage
-   [ ] burst dps
-   [ ] sustained dps
-   [ ] condition effects
-   [ ] applied effectiveness to enemy scaler output
-   [ ] per-mod value contributions

## Localization

-   [x] simple dictionary substition for main bulk of strings
-   [ ] complex substitution for grammar-correct insertion of variables into sentences
-   [ ] attach all text nodes to localization as appropriate
-   [ ] stop shoving data directly into the deploy file and actually use the raws

### Languages

-   [x] "en" - English
-   [ ] "fr" - Français (French)
-   [ ] "it" - Italiano (Italian)
-   [ ] "de" - Deutsch (German)
-   [ ] "sp" - Español (Spanish)
-   [ ] "pt" - Português (Portuguese)
-   [ ] "ru" - Pусский (Russian)
-   [ ] "pl" - Polski (Polish)
-   [ ] "uk" - Українська (Ukrainian)
-   [ ] "tr" - Türkçe (Turkish)
-   [ ] "jp" - 日本語 (Japanese)
-   [ ] "zh-CN" - 中文 (Chinese (Simplified))
-   [ ] "ko" - 한국어 (Korean)

## Data Deployment

-   [x] Script that converts raw/\* into web-deployed files
-   [ ] data compression
-   [x] basic warnings for id conflicts and blank id
-   [ ] Warning generation for unlocalized terms per language.

### Deployment Coverage
-   [x] basic coverage for weapon raws
-   [x] basic coverage for mod raws
-   [ ] basic coverage for warframe raws
-   [ ] basic coverage for companion raws

## Enemy Scaling

-   [ ] health type data
-   [ ] Remember to treat armor and health types as a single table internally so that certain enemies don't require specialcasing.
-   [ ] enemy data
-   [ ] scaling calculations
-   [ ] ui stuff
-   [ ] expose results to integration with damage calculation results
-   [ ] support for tileset-based enemy spreads
-   [ ] support for special enemy spreads eg oro100