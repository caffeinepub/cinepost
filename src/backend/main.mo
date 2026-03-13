import Array "mo:core/Array";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Store "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  // Include storage and initialize state
  include MixinStorage();

  // Include authorization and initialize state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public type MovieId = Nat;
  public type Genre = {
    #action;
    #comedy;
    #drama;
    #horror;
    #sciFi;
    #thriller;
    #romance;
    #documentary;
    #animation;
    #other;
  };

  public type Movie = {
    id : MovieId;
    title : Text;
    description : Text;
    genre : Genre;
    releaseYear : Nat;
    rating : Nat; // 1-10
    posterUrl : Text;
    owner : Principal;
    createdAt : Int;
  };

  let movies = Map.empty<MovieId, Movie>();
  var nextMovieId : MovieId = 1;

  // Persistent storage reference type
  public type PersistentMovieStore = {
    poster : Store.ExternalBlob;
    title : Text;
    description : Text;
    genre : Genre;
    releaseYear : Nat;
    rating : Nat; // 1-10
    owner : Principal;
    createdAt : Int;
    id : MovieId;
  };

  var initialized = false;

  // Persistent methods
  public query ({ caller }) func getMovie(id : MovieId) : async Movie {
    switch (movies.get(id)) {
      case (null) { Runtime.trap("Movie not found") };
      case (?movie) { movie };
    };
  };

  public query ({ caller }) func getAllMovies() : async [Movie] {
    movies.values().toArray();
  };

  public query ({ caller }) func searchMovies(searchText : Text) : async [Movie] {
    let lowerSearchText = searchText.toLower();
    movies.values().toArray().filter(
      func(movie) {
        movie.title.toLower().contains(#text lowerSearchText) or
        movie.description.toLower().contains(#text lowerSearchText)
      }
    );
  };

  public shared ({ caller }) func createMovie(
    title : Text,
    description : Text,
    genre : Genre,
    releaseYear : Nat,
    rating : Nat,
    posterUrl : Text,
  ) : async MovieId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create movies");
    };
    if (title.isEmpty() or description.isEmpty() or rating < 1 or rating > 10) {
      Runtime.trap("Invalid movie data");
    };
    let id = nextMovieId;
    nextMovieId += 1;
    let movie : Movie = {
      id;
      title;
      description;
      genre;
      releaseYear;
      rating;
      posterUrl;
      owner = caller;
      createdAt = 0;
    };
    movies.add(id, movie);
    id;
  };

  public shared ({ caller }) func updateMovie(
    id : MovieId,
    title : Text,
    description : Text,
    genre : Genre,
    releaseYear : Nat,
    rating : Nat,
    posterUrl : Text,
  ) : async () {
    switch (movies.get(id)) {
      case (null) { Runtime.trap("Movie not found") };
      case (?existing) {
        if (existing.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the owner or admin can edit this movie");
        };
        if (title.isEmpty() or description.isEmpty() or rating < 1 or rating > 10) {
          Runtime.trap("Invalid movie data");
        };
        let updated : Movie = {
          id;
          title;
          description;
          genre;
          releaseYear;
          rating;
          posterUrl;
          owner = existing.owner;
          createdAt = existing.createdAt;
        };
        movies.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteMovie(id : MovieId) : async () {
    switch (movies.get(id)) {
      case (null) { Runtime.trap("Movie not found") };
      case (?movie) {
        if (movie.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the owner or admin can delete this movie");
        };
        movies.remove(id);
      };
    };
  };

  public shared ({ caller }) func initialize() : async () {
    if (initialized) { Runtime.trap("Already initialized") };
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize");
    };

    // Seed sample movies
    let sampleMovies = [
      {
        id = nextMovieId;
        title = "Inception";
        description = "A mind-bending thriller";
        genre = #sciFi;
        releaseYear = 2010;
        rating = 9;
        posterUrl = "https://example.com/inception.jpg";
        owner = caller;
        createdAt = 0;
      },
      {
        id = nextMovieId + 1;
        title = "The Godfather";
        description = "Classic mafia drama";
        genre = #drama;
        releaseYear = 1972;
        rating = 10;
        posterUrl = "https://example.com/godfather.jpg";
        owner = caller;
        createdAt = 0;
      },
      {
        id = nextMovieId + 2;
        title = "Forrest Gump";
        description = "Life is like a box of chocolates";
        genre = #drama;
        releaseYear = 1994;
        rating = 9;
        posterUrl = "https://example.com/forrestgump.jpg";
        owner = caller;
        createdAt = 0;
      },
    ];
    nextMovieId += 3;

    for (movie in sampleMovies.values()) {
      movies.add(movie.id, movie);
    };
    initialized := true;
  };
};
