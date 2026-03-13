# CinePost - Movie Posting Website

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Movie listing page (home) showing all posted movies in a grid
- Movie detail page with full info (title, description, genre, release year, rating, poster image)
- Post a movie form (authenticated users only)
- Edit/delete movie (owner only)
- User authentication (login/register)
- Movie poster image upload via blob storage
- Genre filter and search on the listing page
- Sample movies seeded on first load

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Select `authorization` and `blob-storage` components
2. Generate Motoko backend with Movie data type (id, title, description, genre, releaseYear, rating, posterUrl, ownerId, createdAt)
3. Backend CRUD: createMovie, getMovies, getMovie, updateMovie, deleteMovie
4. Frontend: home grid, movie detail modal/page, post form with image upload, genre filter + search, auth flows
