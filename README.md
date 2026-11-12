# Magneto Ultimate Damage Calculator

An unofficial, fan-made calculator for exploring Magneto's ultimate damage and its effect on the listed Marvel Rivals heroes.

**GitHub Pages URL:** https://buddyboom.github.io/marvel-rivals-magneto-ultimate/

## What it does

- Adjust charge duration, Energy, and distance from the spell-field center.
- See the calculated damage, spell radius, damage falloff, and remaining hero HP.
- Browse heroes by role and toggle hero names, HP numbers, and health bars.
- Use the controls with a mouse, touch screen, or keyboard.

## Using the calculator

- **Charge duration:** 0-5 seconds. The spell-field radius grows from 5m to 8m over the first 4 seconds, then stays at 8m.
- **Energy:** Each point adds 3 damage to the spell field. The calculator treats 100 Energy as an overload/self-destruct.
- **Distance from center:** Damage falls with distance, reaching 50% of center damage at 6m. Targets beyond the current field radius take no damage.

The calculator follows the ability description used for this project and is an estimate, not an official game tool. It assumes center damage increases linearly from 100 at 0 seconds to 350 at 5 seconds; falloff decreases linearly to 50% at 6m and remains at 50% farther out; damage values are rounded down to whole numbers. Hero health and ability behavior may change between game updates. Check current in-game values before relying on the results.

## Run locally

This is a static site and has no package installation or build step. From the project root, run a local web server, for example:

```sh
python -m http.server 8000
```

Then open http://localhost:8000. Alternatively, open `index.html` directly in a browser.

Keep the site files in their existing relative locations:

- `index.html`
- `styles.css`
- `js/`
- `data/`
- `assets/heroes/`

## Tests

The damage calculation tests use Node.js's built-in test runner and need no installed dependencies:

```sh
node --test
```

Ability values shared by the calculator, controls, and tooltips are defined in `data/ability.js`.

## Corrections

If you spot inaccurate data or have a suggested correction, use the link at the bottom of the live site or [open a new issue](https://github.com/buddyboom/marvel-rivals-magneto-ultimate/issues/new).

## Ownership and third-party assets

This is an unofficial fan project. It is not affiliated with, endorsed by, or sponsored by Marvel, NetEase, or their affiliates.

The hero portrait images in `assets/heroes/` were sourced from [tiermaker.com](https://tiermaker.com/create/marvel-rivals-characters-17333617) and depict Marvel Rivals characters. I do not own or claim ownership of those images, the underlying artwork, character names, game content, or any other third-party art or intellectual property used here. All such rights belong to their respective owners. tiermaker.com is identified as the source of the portrait files, not as the owner of the underlying Marvel Rivals artwork.

The GitHub mark in the page footer uses the `mark-github` icon from [GitHub Primer Octicons](https://github.com/primer/octicons), which is licensed under the [MIT License](https://github.com/primer/octicons/blob/main/LICENSE).

Mentioning a source or disclaiming ownership does not grant permission to use or redistribute third-party material. No rights to third-party assets are granted by this project. Check the applicable rights-holder and platform policies before publishing or reusing the images, especially for commercial purposes.

## License

The original code in this project is licensed under the [MIT License](./LICENSE), with copyright attributed to `buddyboom`. This license does not apply to the hero portraits, Marvel Rivals names or content, or any other third-party material; those remain subject to their respective owners' rights and terms. No license to third-party material is granted here.
