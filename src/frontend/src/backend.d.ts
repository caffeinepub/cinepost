import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Movie {
    id: MovieId;
    title: string;
    owner: Principal;
    createdAt: bigint;
    description: string;
    genre: Genre;
    posterUrl: string;
    rating: bigint;
    releaseYear: bigint;
}
export interface UserProfile {
    name: string;
}
export type MovieId = bigint;
export enum Genre {
    action = "action",
    thriller = "thriller",
    documentary = "documentary",
    other = "other",
    animation = "animation",
    sciFi = "sciFi",
    comedy = "comedy",
    horror = "horror",
    drama = "drama",
    romance = "romance"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createMovie(title: string, description: string, genre: Genre, releaseYear: bigint, rating: bigint, posterUrl: string): Promise<MovieId>;
    deleteMovie(id: MovieId): Promise<void>;
    getAllMovies(): Promise<Array<Movie>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMovie(id: MovieId): Promise<Movie>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchMovies(searchText: string): Promise<Array<Movie>>;
    updateMovie(id: MovieId, title: string, description: string, genre: Genre, releaseYear: bigint, rating: bigint, posterUrl: string): Promise<void>;
}
