# tripweather

[![main](https://github.com/dwmkerr/lifeline/actions/workflows/main.yaml/badge.svg)](https://github.com/dwmkerr/lifeline/actions/workflows/main.yaml) [![codecov](https://codecov.io/gh/dwmkerr/tripweather/graph/badge.svg?token=7e6XaNFvoG)](https://codecov.io/gh/dwmkerr/tripweather)

Experimentation project for a climbing trip planner app

https://lifeline.rocks

<!-- vim-markdown-toc GFM -->

- [Developer Guide](#developer-guide)
    - [Firebase](#firebase)
- [Releasing](#releasing)
- [Research](#research)
- [TODO](#todo)

<!-- vim-markdown-toc -->

## Developer Guide

| Command | Description |
| ------- | ----------- |
| `npm run lint` | Lint the code with eslint/prettier |
| `npm run lint:fix` | Fix the code with eslint/prettier |

### Firebase

Use the [Firebase Local Emulator Suite](https://firebase.google.com/docs/emulator-suite) to help when working with Firebase.

Setup looks like this:

```bash
# Install firebase CLI tools, then login.
curl -sL firebase.tools | bash
firebase login

# Initialise the firebase project (not needed for most users, only if you are
# forking and building your own project from scratch).
#
# firebase init
#
# Choose: Firestore, Emulators. Lifeline project. Default options seem to be fine.

# Start the emulator, optionally open the web interface.
firebase emulators:start
open http://localhost:4000
```

Deploy indexes and rules with:

```bash
fireabase deploy --only firestore
```

## Releasing

This project uses [Release Please](https://github.com/googleapis/release-please) to manage releases. As long as you use [Conventional Commit messages](https://www.conventionalcommits.org/en/v1.0.0/), release please will open up a 'release' pull request on the `main` branch when changes are merged. Merging the release pull request will trigger a full release to NPM.

```bash
VERSION="0.1.0" git commit --allow-empty -m "chore: release ${VERSION}" -m "Release-As: ${VERSION}"
```

Note that currently firestore configuration (security rules and indexes) is not deployed as part of this process, to avoid unexpected downtime while indexes rebuild. Manually deploy these changes as needed.

## Research

Front end component framework:

- [MUI Core](https://mui.com) really solid looking react components based on Material UI. Has 'suggest' boxes.
- [Joy UI](https://mui.com/joy-ui/getting-started/) looks like great React Components, same authors as Material UI above but less google-centric. Has 'suggest' boxes.

Geolocation Services:

- [ArcGIS](https://developers.arcgis.com/rest/): API is simple and well-documented, [pricing](https://developers.arcgis.com/pricing/) seems not too bad for now for experimenting.

Weather Services:

- [PirateWeather](https://pirateweather.net/en/latest/): based on government-provided weather sources, drop in replacement for Dark Sky, 15000 requests per month
- [OpenWeather](https://openweathermap.org/): more commercial than the above

## TODO

- [x] check name 'trip weather'
- [x] feat: weather icon - sunshine
- [x] feat: basic structure - search bar and suggest function
- [ ] feat: error handling and context
- [ ] feat: add location to list

v0.2

- [ ] feat: activity select in navbar
- [ ] feat: save search details
- [ ] feat: share button offers link to share
- [ ] feat: open saved trip from URL
- [ ] feat: name trips
- [ ] feat: 'my trips'

- [ ] feat: show weather for selected location
- [ ] feat: save location as favourite, quick search for favourites
- [ ] score icons for walking/climbing
- [ ] ads based on score icons, e.g. climbing books for selected area
- [ ] feat: spinner when loading location suggestions
