# Tasks: Add Organization Locations

## Phase 1 — Foundation

- [x] 1.1 Install `country-state-city` package (`pnpm add country-state-city`)
- [x] 1.2 Update `organizationSchema` in `schemas.ts` — replace `country: z.string().optional()` with `locations: z.array(locationSchema).min(1)` + default validation refine
- [x] 1.3 Update entity registry — change `requiredFields` for organizations from `["name", "type", "status"]` to `["name", "type", "status", "locations"]`

## Phase 2 — LocationEditor Component

- [x] 2.1 Create `app/src/portal/components/LocationEditor.tsx` — country combobox (searchable, from `Country.getAllCountries()`), city combobox (from `City.getCitiesOfCountry()`), default radio, add/remove buttons
- [x] 2.2 Integrate LocationEditor into `OrganizationFormPage.tsx` — replace the `country` text input with LocationEditor, wire to react-hook-form `useFieldArray` for locations
- [ ] 2.3 Verify form submission: create org with 1 location, create org with 2+ locations, verify locations array is saved to Mujarrad nodeDetails

## Phase 3 — Map Page

- [x] 3.1 Update `MapPage.tsx` — read `org.locations` array instead of `org.country`, render markers at city-level lat/lng, remove `COUNTRY_COORDS` hardcoded map
- [x] 3.2 Support multi-pin per org — each location renders a separate marker, tooltip shows org name + city
- [x] 3.3 Handle edge cases — orgs with no locations (skip), orgs with locations missing lat/lng (skip that location)

## Phase 4 — Polish

- [x] 4.1 Update organization list/detail pages if they display country — show default location's country + city instead
- [ ] 4.2 Backward compat for existing data — orgs with old `country` string should still render (map falls back to country centroid if no locations array)
- [ ] 4.3 Verify mock provider works (`VITE_USE_MOCK=true`) — mock seed data includes locations on sample orgs

## Verification
- Create org with Saudi Arabia → Riyadh → appears on map at Riyadh
- Add second location Malaysia → Kuala Lumpur → two pins on map
- Toggle default location → default marker indicated
- Edit existing org → locations preserved
- Map page loads with all org locations rendered at city level
