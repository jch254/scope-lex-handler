# [Scope](https://m.me/scopebot)

[![Scope Vimeo demo](https://img.jch254.com/ScopeVimeo.png)](https://vimeo.com/225540115 "Scope Vimeo demo - Click to Watch!")

Scope is a Facebook Messenger bot that identifies songs from lyrics/titles. Scope returns detailed information about songs it matches including title, artist, album, release date, recording location, BPM, key, samples, featured artists, producers and writers (where available). Scope also returns direct Spotify, Apple Music, Soundcloud, YouTube and Genius links to the song. Scope is powered by Genius and Spotify APIs so matches are slightly biased towards hiphop and rap music (Genius started off as Rap Genius).

It's easy to scope a song - just send a message starting with 'scope' followed by the lyric/title you're after (e.g. scope waves). Scope will reply with details of the closest match. If Scope matches the wrong song, simply reply with the word 'wrong' to select from the next best matches.

Hit up Scope at [https://m.me/scopebot](https://m.me/scopebot) or [https://facebook.com/scopebot](https://facebook.com/scopebot)

### Technologies Used

- Node.js
- TypeScript
- Terraform
- Lex
- Lambda
- CodeBuild
- Facebook Messenger Platform
- Spotify API
- Genius API

### What's next for Scope?

- Add/improve sharing functionality
- Add suggestions
- Add more intents/interactions
- Add Scope for other media - movies/TV/quotes etc.

> _Do you fools listen to music or do you just skim through it? - JAY-Z_

---

### Environment variables

- SPOTIFY_CLIENT_ID
- SPOTIFY_CLIENT_SECRET
- GENIUS_ACCESS_TOKEN
- PAGE_ACCESS_TOKEN

### Running locally (with hot reloading)

1. Set environment variables listed above
1. Configure event in [/src/test.ts](./src/test.ts) (see [/src/LexEvent.ts](./src/LexEvent.ts) for event structure)
1. `yarn run test`

### Deployment/Infrastructure

Refer to the [/infrastructure](./infrastructure) directory.
