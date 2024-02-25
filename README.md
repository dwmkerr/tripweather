# tripweather

[![main](https://github.com/dwmkerr/lifeline/actions/workflows/main.yaml/badge.svg)](https://github.com/dwmkerr/lifeline/actions/workflows/main.yaml) [![codecov](https://codecov.io/gh/dwmkerr/tripweather/graph/badge.svg?token=7e6XaNFvoG)](https://codecov.io/gh/dwmkerr/tripweather)

Experimentation project for a climbing trip planner app

https://lifeline.rocks

<!-- vim-markdown-toc GFM -->

- [Developer Guide](#developer-guide)
    - [Firebase](#firebase)
    - [Firebase Functions](#firebase-functions)
- [Releasing](#releasing)
- [Service Tiers](#service-tiers)
    - [Guest](#guest)
    - [User](#user)
    - [Subscriber](#subscriber)
- [Research](#research)
- [TODO](#todo)

<!-- vim-markdown-toc -->

## Developer Guide

| Command | Description |
| ------- | ----------- |
| `npm run start` | Run the website locally, connected to the cloud |
| `npm run start:local` | Run the website locally, connected to the local emulator |
| `npm run lint` | Lint the code with eslint/prettier |
| `npm run lint:fix` | Fix the code with eslint/prettier |

### Firebase

Use the [Firebase Local Emulator Suite](https://firebase.google.com/docs/emulator-suite) to help when working with Firebase.

Setup looks like this:

```bash
# Install firebase CLI tools, then login.
# Don't install with:
#   curl -sL https://firebase.tools | bash
# As this seems to suffer from some CLI issues:
#   - https://github.com/firebase/firebase-tools/issues/6446
npm install -g firebase-tools
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

### Firebase Functions

To watch for changes in the code and run the Firebase functions in the emulator, run:

```bash
npm run emulate
```

To [test functions interactively](https://firebase.google.com/docs/functions/local-shell):

```bash
firebase functions:shell

# Then e.g:
# await weather({data: {latitude: "-1.56266", longitude: "53.11893"}})
# await arcGisSuggest({data: {location: "Peak District"}})
```

Firebase function parameters and configuration are defined in `./functions/src/parameters.ts`. These parameters are loaded from Firebase at runtime, but can also be defined in `./functions/.secrets.local` if needed.

## Releasing

This project uses [Release Please](https://github.com/googleapis/release-please) to manage releases. As long as you use [Conventional Commit messages](https://www.conventionalcommits.org/en/v1.0.0/), release please will open up a 'release' pull request on the `main` branch when changes are merged. Merging the release pull request will trigger a full release to NPM.

```bash
VERSION="0.1.0" git commit --allow-empty -m "chore: release ${VERSION}" -m "Release-As: ${VERSION}"
```

Note that currently firestore configuration (security rules and indexes) is not deployed as part of this process, to avoid unexpected downtime while indexes rebuild. Manually deploy these changes as needed.

## Service Tiers

### Guest

- Can use one location
- Can use one week

### User

- Can use five locations
- Can use one week
- Can share and view/edit other trips

### Subscriber

- Unlimited locations
- Unlimited dates

## Research

Front end component framework:

- [MUI Core](https://mui.com) really solid looking react components based on Material UI. Has 'suggest' boxes.
- [Joy UI](https://mui.com/joy-ui/getting-started/) looks like great React Components, same authors as Material UI above but less google-centric. Has 'suggest' boxes.

Geolocation Services:

- [ArcGIS](https://developers.arcgis.com/rest/): API is simple and well-documented, [pricing](https://developers.arcgis.com/pricing/) seems not too bad for now for experimenting.

Weather Services:

- [PirateWeather](https://pirateweather.net/en/latest/): based on government-provided weather sources, drop in replacement for Dark Sky, 15000 requests per month
- [OpenWeather](https://openweathermap.org/): more commercial than the above

Weather icons:

Amazing icons at: https://basmilius.github.io/weather-icons/index-line.html

## TODO

- [x] check name 'trip weather'
- [x] feat: weather icon - sunshine
- [x] feat: basic structure - search bar and suggest function
- [x] feat: error handling and context
- [x] feat: add location to list
- [x] feat: main page with navbar
- [x] feat: main page search
- [x] feat: basic weather api call
- [x] feat: handle weather api errors e.g https://api.pirateweather.net/forecast/bpUlCYTXUho6JuCR7bD0dWdrscOHtlBw/150.37111,150.37111
- [x] feat: basic location grid
- [x] feat: settings context with specification of start / end date
- [x] feat: start/end date in search bar
- [ ] feat: weather grid, showing specified days
- [ ] feat: when change dates, mark weather as stale and refresh
- [ ] feat: main page list, with location details having a loader
- [ ] feat: delete location
- [ ] feat: re-order locations
- [ ] feat: set location label?
- [ ] chore: recycle arcgis keys
- [ ] feat: weather icon credits in footer - other credits too? arcgis/pirate
- [ ] refactor: hydrate dates weather can ignore weather we've already loaded
- [ ] feat: settings drawer

v0.2

- [ ] feat: pinned/favourite locations
- [ ] feat: activity select in navbar
- [ ] feat: save search details
- [ ] feat: share button offers link to share
- [ ] feat: open saved trip from URL
- [ ] feat: name trips
- [ ] feat: 'my trips'
- [ ] feat: debounce search input

v0.3

- [ ] better date range selector, before search bar

- [ ] feat: show weather for selected location
- [ ] feat: save location as favourite, quick search for favourites
- [ ] score icons for walking/climbing
- [ ] ads based on score icons, e.g. climbing books for selected area
- [ ] feat: spinner when loading location suggestions
