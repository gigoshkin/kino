# Kino XII

Frontend for a cinema ticket booking app. Browse films, filter showtimes, pick seats on a hall map and pay for tickets, then manage tickets and refunds from the profile page.

Built for the Redberry Georgia bootcamp assignment. The design is based on a 1728px Figma frame and scaled up to 1920x1080.

## Stack

- React 19 + Vite, plain JavaScript
- React Router (declarative mode)
- TanStack Query for all server state
- React Hook Form for forms
- Tailwind CSS v4 (tokens live in `src/index.css`)

## Run it

```bash
npm install
cp .env.example .env
npm run dev
```

`.env` needs the API base URL:

```
VITE_API_URL=https://api.kinoxii.redberryinternship.ge/api
```

Other scripts: `npm run build`, `npm run lint`.

## Pages

- `/` Home with the featured hero carousel, recently viewed, now playing and coming soon
- `/sessions` Filters, date picker, sorting and pagination, all stored in the URL query string
- `/movie/:slug` Film details with sessions per hall for the selected day
- `/profile` Personal information form and My Tickets (upcoming, past, refunds)

Login, sign up and the two-step booking flow are modals, so the URL never changes for them.

## How it is put together

- `src/api` has one small `request` wrapper that adds the bearer token and throws an `ApiError` with the status and parsed body. Endpoint functions are grouped by area.
- `src/context` holds auth (user, token, modals, an action to replay after login) and the booking modal state.
- A 401 from any protected request clears the token, opens the login modal and replays the action once the user signs in.
- Filter options (venues, formats, languages, ticket types, seat limit, hold time) come from `/filter-options` and are cached for the whole session. Nothing like that is hardcoded.
- The booking modal uses a reducer. Seats are held on "Next: Checkout", the countdown runs from the server `expiresAt`, and the hold is released when the modal is closed. A 409 removes the lost seats from the selection and refetches the hall map.
- Lists have skeleton, empty and error states with a retry button.
- Scaling to 1920px is done with CSS `zoom` on the root element.

## Deploy

Netlify builds the app from `main`. `public/_redirects` sends every route to `index.html` so deep links and refreshes work.
