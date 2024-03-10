# TODO

## 0.3.x

- [x] feat: enter key for address/gps/favorite search to confirm entry
- [x] bug: typing doesn't work on GPS, need to work on this it is disabled for now
- [x] feat: debounce search input
- [ ] feat: store current trip in browser cache when user not logged in - basially use document.add, work with the document, offer 'save to my trips' and guard save with the user log in, then we're good, use 'isDraft' in the model and when isDraft do not save or persist changes, offer option to save and guard w/ login. find the right moments to use an alert to suggest login
- [ ] refactor: ensure favorites and trips are per-user collections (has been a hard bug to fix)
- [ ] feat: when user logged in, enable 'save trip' option "Save to My Trips"
- [x] feat: enable add only when valid gps and mask gps input
- [ ] bug: clear selection on address add
- [ ] feat: set location label? (see TODO in code)
- [ ] bug: undefined cell value when shortening end date range
- [ ] refactor: favourites as a sub-collection of user
- [ ] bug: after address or GPS (or favorite) is selected and added, clear the selection
- [ ] bug: if can't set weather show an error icon in the weather panel
- [ ] bug: user login state is not refreshed it seems, or at least they log out v quick

**Needs bug fix**

- [ ] bug: state management bug in onRemoveFavoriteLocation, also user in requirelogin
- [ ] feat: favorite - require sign in to use
- [ ] bug: hydrating weather updates locations, but the user can add another location in parallel, meaning we have a race condition when updating locations. This'll be a tricky one to fix.

**Nice to have**

- [x] warnings in console when searching for location
- [ ] feat: manage favorites page
- [ ] minor bug (settings): on date change, when make starting day current val + 1 get pop error
- [ ] minor bug (settings): on unit change, new units flash before the loader updates
- [ ] refactor: hydrate dates weather can ignore weather we've already loaded
- [ ] monitor: do we still lose the search from time to time in the address search bar?


vNext

- [ ] feat: better date range selector, more compact
- [ ] feat: weather icon is link to details on Merry Sky
- [ ] feat: pinned/favourite locations, use AirBnB trips as an example of UI
- [ ] feat: activity select in navbar
- [ ] feat: save search details
- [ ] feat: share button offers link to share
- [ ] feat: open saved trip from URL
- [ ] feat: name trips
- [ ] feat: 'my trips'
- [ ] feat(settings): temperature: apparent/recorded low/high/max/min
- [ ] feat: settings drawer with farhenhiet / celcius selector

vNext

- [ ] better date range selector, before search bar
- [ ] feat: toggle grid/map/grid+map view
- [ ] feat: save units as a user preference
- [ ] feat: show weather for selected location
- [ ] feat: save location as favourite, quick search for favourites
- [ ] score icons for walking/climbing
- [ ] ads based on score icons, e.g. climbing books for selected area
- [ ] feat: spinner when loading location suggestions

### Future

- Location map
- Omnisearch that handles address, gps or favorite

**X-Data-Grid Pro**

- [ ] feat: re-order locations
- [ ] feat: resize columns
