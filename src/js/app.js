var typingTimer;                //timer identifier
var doneTypingInterval = 350;  //time in ms (5 seconds)

var data_watchlist = {
	watchlistData: database.getWatchlist(),
	watchlistCount: database.getWatchlist().length,
}

Vue.component('app-nav', {
	template: '<header class="app-header">\
					<ul class="tab tab-block">\
						<router-link tag="li" class="tab-item" to="/" exact active-class="active">\
		  					<a>\
		  						<span class="lnr lnr-magnifier"></span> <span class="hidden-xs">Explore</span>\
	  						</a>\
						</router-link>\
						<router-link tag="li" class="tab-item" to="/watchlist" exact active-class="active">\
		  					<a v-bind:class="{ badge: watchlistCount }" v-bind:data-badge="watchlistCount">\
		  						<span class="lnr lnr-bookmark"></span> <span class="hidden-xs">Watchlist</span>\
		  					</a>\
						</router-link>\
						<router-link tag="li" class="tab-item" to="/profile" exact active-class="active">\
							<a>\
								<figure class="avatar avatar-xs" data-initial="YZ" style="background-color: #5764c6;">\
	                      				<img src="img/avatar-2.png">\
	                			</figure> <span class="hidden-xs">Profile</span>\
                			</a>\
						</router-link>\
						<router-link tag="li" class="tab-item" to="/watch-now" exact active-class="active">\
							<a>\
								<span class="lnr lnr-film-play"></span> <span class="hidden-xs">Watch Now</span>\
                			</a>\
						</router-link>\
					</ul>\
				</header>',
	data: function() {
		return data_watchlist
	},
	watch: {
		watchlistData: function() {
			this.countWatchlist();
		}
	},
	methods: {
		countWatchlist: function() {
			data_watchlist.watchlistCount = data_watchlist.watchlistData.length;
		}
	}
});

Vue.component('explore_view', {

	template: '<div class="container grid-960">\
					<div class="columns">\
		    			<div class="column col-6 col-md-8 col-sm-12 col-xs-12 centered">\
		    				<form v-on:submit.prevent="searchMovie">\
					    		<div class="input-group">\
								    <input type="text" class="form-input"  v-on:keyup="searchMovie" v-model="query" placeholder="Search movies..." />\
								    <button v-bind:disabled="!query" v-bind:class="{ loading: loading }" class="btn btn-primary input-group-btn">Search</button>\
								</div>\
							    <div class="form-group">\
							        <label class="form-switch">\
							            <input type="checkbox" v-model="showAdvancedFilters">\
							            <i class="form-icon"></i> <span v-cloak>{{advancedFilterText}}</span>\
							        </label>\
							    </div>\
							</form>\
							<div class="column col-xs-12 text-center">\
			                    <div class="btn-group">\
			                        <button v-on:click="popularMovies" v-bind:class="{ active: listPick == \'popular\' }" class="btn btn-sm">Popular</button>\
			                        <button v-on:click="topRatedMovies" v-bind:class="{ active: listPick == \'toprated\' }" class="btn btn-sm">Top Rated</button>\
			                        <button v-on:click="upcomingMovies" v-bind:class="{ active: listPick == \'upcoming\' }" class="btn btn-sm">Upcoming</button>\
			                    </div>\
			                </div>\
						</div>\
					</div>\
					<div class="text-center" v-show="searchMessage" v-cloak>{{searchMessage}}</div>\
					<div class="columns col-multiline">\
					 	<div class="column col-3 col-md-4 col-sm-6 col-xs-12" v-for="(movie, index) in movies" v-bind:movie="movie" v-cloak>\
					 		<div class="card movie-card">\
					 			<div v-on:click="singleMovieUrl(movie.id)" class="card-image">\
					 				<div v-if="movie.poster_path" v-bind:style="{backgroundImage: \'url(https://image.tmdb.org/t/p/w500\' + movie.poster_path + \')\'}"></div>\
				 					<p v-if="!movie.poster_path" class="card-meta">No poster</p>\
					 			</div>\
					 			<div class="card-header" v-on:click="showSingleMovieInfo(movie.id)">\
							        <h4 class="card-title">{{movie.title}}</h4>\
							        <h6 class="card-meta"> {{ movie.release_date | makeYear }} <span class="lnr lnr-star"></span> {{movie.vote_average | filterRating}}</h6>\
							    </div>\
							    <div class="card-footer">\
							    </div>\
						        <div class="btn-group btn-group-block">\
								    <button class="btn tooltip tooltip-bottom" data-tooltip="Skip Movie"><span class="lnr lnr-cross"></span></button>\
								    <button class="btn tooltip tooltip-bottom" data-tooltip="Already Watched"><span class="lnr lnr-eye"></span></button>\
								    <button class="btn tooltip tooltip-bottom" data-tooltip="Add to Watchlist" v-on:click="addToWatchList(movie)"><span class="lnr lnr-bookmark"></span></button>\
								</div>\
					 		</div>\
					 	</div>\
					</div>\
				</div>',
	data: function() {
		return {
			query: null,
			movies: null,
			loading: false,
			singleMovieInfo: false,
			searchMessage: "Search for something",
			showAdvancedFilters: false,
			listPick: false
		}
	},
	watch: {
		listPick: function() {
			self = this;
			if (self.listPick) {
				self.query = null;
			}
		}

	},
	computed: {
		advancedFilterText: function() {
			if(this.showAdvancedFilters) {
				return "Hide advanced filters";
			} else {
				return "Show advanced filters";
			}
		}
	},
	methods: {
		singleMovieUrl: function(movieID) {
			router.push({ name: 'singleMovieRoute', params: { id: movieID }})
		},
		popularMovies: function() {
			self = this;
			self.listPick = "popular";
			$.ajax({
				url: "https://api.themoviedb.org/3/movie/popular",
				data: {
					language: "en-US",
					api_key: "50552c8bec3a5e29168458ab7506252b"
				},
				dataType: 'json'
			}).done(function(data) {
				self.movies = data.results;
				self.searchMessage = "Popular Movies"
			});
		},
		topRatedMovies: function() {
			self = this;
			self.listPick = "toprated";
			$.ajax({
				url: "https://api.themoviedb.org/3/movie/top_rated",
				data: {
					language: "en-US",
					api_key: "50552c8bec3a5e29168458ab7506252b"
				},
				dataType: 'json'
			}).done(function(data) {
				self.movies = data.results;
				self.searchMessage = "Top Rated Movies"
			});
		},
		upcomingMovies: function() {
			self = this;
			self.listPick = "upcoming";
			$.ajax({
				url: "https://api.themoviedb.org/3/movie/upcoming",
				data: {
					language: "en-US",
					api_key: "50552c8bec3a5e29168458ab7506252b"
				},
				dataType: 'json'
			}).done(function(data) {
				self.movies = data.results;
				self.searchMessage = "Upcoming Movies"
			});
		},
		searchMovie: function() {
			self = this;
			self.listPick = false;
			self.loading = true;
			self.searchMessage = "Searching...";
			clearTimeout(typingTimer);
			if (self.query) {
				typingTimer = setTimeout(function() {
					$.ajax({
						url: "https://api.themoviedb.org/3/search/movie",
						data: {
							query: encodeURI(self.query),
							language: "en-US",
							api_key: "50552c8bec3a5e29168458ab7506252b"
						},
						dataType: 'json'
					}).done(function(data) {
							self.movies = data.results;
							self.loading = false;
						if(!data.results.length > 0 ) {
							self.searchMessage = "Nothing found";
						} else {
							self.searchMessage = "Found " + data.results.length + " movies";
						}
					});
				},
				doneTypingInterval);
			} else {
				self.movies = null;
				self.loading = false;
				self.searchMessage = "Search for something"
			}
		},
		closeModal: function() {
			self = this;
			self.singleMovieInfo = false;
		},
		addToWatchList: function(movie) {
		  	data_watchlist.watchlistData = database.addWatchlist(movie);
		}
	},
	filters: {
  		filterRating: function(value) {
  			if (value == 0) {
  				return 'N/A';
  			} else {
  				return value;
  			}
  		}
  	}
});

Vue.component( 'watchlist_view', {
	template: '<div class="container grid-960">\
					<h3 class="text-center">My Watchlist</h3>\
					<ul class="watchlist-listing">\
						<li v-for="movie in showWatchlist" class="watchlist-single">\
							<div class="columns">\
								<div class="column col-1 watchlist-single-img hidden-xs hidden-sm" v-on:click="singleMovieUrl(movie.id)">\
									<img v-if="movie.poster_path" v-bind:src="posterLink(movie.poster_path)">\
								</div>\
								<div class="column col-9 col-md-9 col-sm-8 col-xs-8" v-on:click="singleMovieUrl(movie.id)">\
									<h5 class="watchlist-single-title">{{movie.title}}</h5>\
									<p>{{ movie.release_date | makeYear }}</p>\
								</div>\
								<div class="column col-2 col-md-2 col-sm-3 col-xs-4 text-right">\
									<button class="btn btn-sm tooltip tooltip-bottom" data-tooltip="Remove from Watchlist" v-on:click="removeFromWatchlist(movie)"><span class="lnr lnr-cross"></span></button>\
									<button class="btn btn-sm tooltip tooltip-bottom" data-tooltip="Watched"><span class="lnr lnr-eye"></span></button>\
								</div>\
							</div>\
						</li>\
					</ul>\
					<div v-if="watchlistData.length == 0">\
						<p class="text-center">Your watchlist is empty</p>\
						<p class="text-center"><router-link class="btn btn-link" to="/" exact >Explore Movies</router-link></p>\
					</div>\
				</div>',
	data: function() {
		return data_watchlist
	},
	computed: {
		showWatchlist: function() {
			return data_watchlist.watchlistData
		}
	},
	methods: {
		singleMovieUrl: function(movieID) {
			router.push({ name: 'singleMovieRoute', params: { id: movieID }})
		},
		removeFromWatchlist: function(movie) {
		  	data_watchlist.watchlistData = database.addWatchlist(movie);
		},
		posterLink: function(value) {
			return "https://image.tmdb.org/t/p/w154" + value
		}
	}
});

Vue.component( 'profile_view', {
	template: '<div>\
					<div class="container grid-960">\
						<h6 class="text-center">This function is not yet implemented</h6>\
						<h3 class="text-center">My Profile</h3>\
						<div class="text-center">\
							<figure class="avatar avatar-xl">\
		    					<img src="img/avatar-1.png" />\
							</figure>\
							<h4>Tobias Sernhede</h4>\
						</div>\
					</div>\
					<ul class="tab tab-block">\
					    <li class="tab-item active">\
					        <a href="#">Feed</a>\
					    </li>\
					    <li class="tab-item">\
					        <a href="#" class="active">Friends</a>\
					    </li>\
					    <li class="tab-item">\
					        <a href="#">Followers</a>\
					    </li>\
					    <li class="tab-item">\
					        <a href="#">Following</a>\
					    </li>\
					</ul>\
					<div class="container grid-960">\
					</div>\
				</div>'
});

Vue.component( 'watch_now_view', {
	template: '<div class="container grid-960">\
					<h6 class="text-center">This function is not yet implemented</h6>\
					<h3 class="text-center">Watch Now</h3>\
					<div class="divider"></div>\
					<h5 class="text-center">Who are you watching with?</h5>\
					<div class="column col-6 col-xs-12 centered">\
	                    <div class="form-group">\
	                        <div class="form-autocomplete">\
	                            <div class="form-autocomplete-input">\
	                                <div class="chip-sm">\
	                                    <img src="img/avatar-1.png" class="avatar">\
	                                    <span class="chip-name">Tony Stark</span>\
	                                    <button class="btn btn-clear"></button>\
	                                </div>\
	                                <div class="chip-sm">\
	                                    <img src="img/avatar-2.png" class="avatar">\
	                                    <span class="chip-name">Thor Odinson</span>\
	                                    <button class="btn btn-clear"></button>\
	                                </div>\
	                                <input class="form-input" type="text" placeholder="typing here" :suggestions="friends" :selection.sync="query">\
	                            </div>\
	                            <ul class="form-autocomplete-list">\
	                                <li class="form-autocomplete-item">\
	                                    <div class="chip hand">\
	                                        <div class="chip-icon">\
	                                            <img src="img/avatar-4.png" class="avatar">\
	                                        </div>\
	                                        <div class="chip-content">\
	                                            Steve Rogers\
	                                        </div>\
	                                    </div>\
	                                </li>\
	                                <li class="form-autocomplete-item">\
	                                    <div class="chip hand">\
	                                        <div class="chip-icon">\
	                                            <img src="img/avatar-2.png" class="avatar">\
	                                        </div>\
	                                        <div class="chip-content">\
	                                            Yan Zhu\
	                                        </div>\
	                                    </div>\
	                                </li>\
	                            </ul>\
	                        </div>\
	                    </div>\
	                </div>\
				</div>',
	data: function() {
		return {
			friends: ['Tobias Sernhede', 'Daniel Hesselberg', 'Pia Lundin'],
			query: ''
		}
	}
});

Vue.component( 'single_movie_view', {
	template: '<div class="single-movie">\
					{{movie_info}}\
					<div class="loading" v-if="loading"></div>\
					<div v-if="!loading">\
						<div v-bind:class="{\'has-backdrop\' : movie.backdrop_path}" v-bind:style="{backgroundImage: \'url(https://image.tmdb.org/t/p/w1280\' + movie.backdrop_path + \')\'}">\
							<div class="single-movie-headline">\
								<h3 class="text-center">{{movie.title}}</h3>\
								<h6 class="text-center">{{movie.tagline}}</h6>\
							</div>\
						</div>\
						<div class="single-movie-info container grid-960">\
							<div class="columns">\
								<div class="column col-8 col-sm-10 col-xs-12 centered">\
									<div class="single-movie-meta text-center">\
									<span>Release: {{movie.release_date}}</span>\
									<span>Rating: {{movie.vote_average}}</span>\
									<span>IMDB: {{omdb.imdbRating}}</span>\
									<span>Metascore: {{omdb.Metascore}}</span>\
									</div>\
									<div class="btn-group btn-group-block">\
								    	<button class="btn tooltip tooltip-bottom" data-tooltip="Skip Movie"><span class="lnr lnr-cross"></span> <span class="hidden-xs">Skip</span></button>\
								    	<button class="btn tooltip tooltip-bottom" data-tooltip="Already Watched"><span class="lnr lnr-eye"></span> <span class="hidden-xs">Watched</span></button>\
								    	<button class="btn tooltip tooltip-bottom" data-tooltip="Add to Watchlist" v-on:click="addToWatchList(movie)"><span class="lnr lnr-bookmark"></span> <span class="hidden-xs">+Watchlist</span></button>\
									</div>\
									<div class="divider"></div>\
									<div class="column col-12">\
										<p>{{movie.overview}}</p>\
									</div>\
								</div>\
							</div>\
							<div class="column col-8 col-sm-10 col-xs-12 centered">\
								<h4>Cast</h4>\
							</div>\
							<div v-for="profile in cast" class="cast-profile column col-8 col-sm-10 col-xs-12 centered" v-on:click="peopleUrl(profile.id)">\
								<div class="columns">\
									<div class="col-2">\
										<div v-if="profile.profile_path">\
											<div class="cast-profile-img" v-bind:style="{backgroundImage: \'url(https://image.tmdb.org/t/p/w185\' + profile.profile_path + \')\'}"></div>\
										</div>\
									</div>\
									<div class="col-10 cast-profile-name">\
										<h6><span v-if="profile.character">{{profile.character}} | </span><b>{{profile.name}}</b></h6>\
									</div>\
								</div>\
							</div>\
							<div class="column col-8 col-sm-10 col-xs-12 centered">\
								<h4>Crew</h4>\
							</div>\
							<div v-for="profile in crew" class="cast-profile column col-8 col-sm-10 col-xs-12 centered">\
								<div class="columns">\
									<div class="col-2">\
										<div v-if="profile.profile_path">\
											<div class="cast-profile-img" v-bind:style="{backgroundImage: \'url(https://image.tmdb.org/t/p/w185\' + profile.profile_path + \')\'}"></div>\
										</div>\
									</div>\
									<div class="col-10 cast-profile-name">\
										<h6><b>{{profile.name}}</b> | <small>{{profile.job}}</small></h6>\
									</div>\
								</div>\
							</div>\
						</div>\
					</div>\
				</div>',
	data: function() {
		return {
			movie: null,
			cast: null,
			crew: null,
			omdb: null,
			loading: true
		}
	},
	computed: {
		movie_info: function() {
			self = this
			$.ajax({
				url: "https://api.themoviedb.org/3/movie/" + this.$route.params.id,
				data: {
					language: "en-US",
					api_key: "50552c8bec3a5e29168458ab7506252b"
				},
				dataType: 'json'
			}).done(function(data) {
				self.movie = data;
				$.ajax({
					url: "http://www.omdbapi.com/",
					data: {
						i: self.movie.imdb_id,
						plot: 'full',
						r: 'json'
					},
					dataType: 'json'
				}).done(function(data) {
					self.omdb = data;
					self.loading = false;
				});
			});

			$.ajax({
				url: "https://api.themoviedb.org/3/movie/" + this.$route.params.id + '/credits',
				data: {
					language: "en-US",
					api_key: "50552c8bec3a5e29168458ab7506252b"
				},
				dataType: 'json'
			}).done(function(data) {
				self.cast = data.cast;
				self.crew = data.crew;
			});
		}
	},
	methods: {
		addToWatchList: function(movie) {
		  	data_watchlist.watchlistData = database.addWatchlist(movie);
		},
		peopleUrl: function(peopleID) {
			router.push({ name: 'peopleView', params: { id: peopleID }})
		},
	}
});

Vue.component( 'people_view', {
	template: '<div class="single-profile">{{people_info}}\
					<div v-if="loading" class="loading loading-full"></div>\
					<div class="container grid-960" v-if="!loading">\
						<div class="columns">\
							<div class="column col-8 col-sm-10 col-xs-12 centered">\
								<div v-if="profile.profile_path">\
									<div class="profile-img" v-bind:style="{backgroundImage: \'url(https://image.tmdb.org/t/p/w185\' + profile.profile_path + \')\'}"></div>\
								</div>\
								<h3 class="text-center">{{profile.name}}</h3>\
								<p>{{profile.biography}}</p>\
								<p v-if="profile.birthday"><small>Birthday: {{profile.birthday}}</small></p>\
								<p v-if="profile.deathday"><small>Death: {{profile.deathday}}</small></p>\
								<p v-if="profile.place_of_birth"><small>Place of birth: {{profile.place_of_birth}}</small></p>\
								<div class="divider"></div>\
								<h4>Movies</h4>\
								<div v-for="cast in moviesCast" v-on:click="singleMovieUrl(cast.id)" class="profile-movie-list">\
									{{cast.title}} | {{cast.character}} | {{cast.release_date}}\
								</div>\
								<div v-for="crew in moviesCrew" v-on:click="singleMovieUrl(crew.id)" class="profile-movie-list">\
									{{crew.title}} | {{crew.job}} | {{crew.release_date}}\
								</div>\
							</div>\
						</div>\
					</div>\
				</div>',
	data: function() {
		return {
			profile: null,
			moviesCast: null,
			moviesCrew: null,
			loading: true
		}
	},
	computed: {
		people_info: function() {
			self = this
			$.ajax({
				url: "https://api.themoviedb.org/3/person/" + this.$route.params.id,
				data: {
					language: "en-US",
					api_key: "50552c8bec3a5e29168458ab7506252b"
				},
				dataType: 'json'
			}).done(function(data) {
				self.profile = data;
				self.loading = false;
			});

			$.ajax({
				url: "https://api.themoviedb.org/3/person/" + this.$route.params.id + "/movie_credits",
				data: {
					language: "en-US",
					api_key: "50552c8bec3a5e29168458ab7506252b"
				},
				dataType: 'json'
			}).done(function(data) {
				console.log(data)
				self.moviesCast = data.cast;
				self.moviesCrew = data.crew;
			});
		}
	},
	methods: {
		singleMovieUrl: function(movieID) {
			router.push({ name: 'singleMovieRoute', params: { id: movieID }})
		},
	}
});

var routes = [
	{
  		path: '/',
  		components: {
			default: 'app-nav',
			view: 'explore_view'
		}
	},
  	{
  		path: '/watchlist',
  		components: {
  			default: 'app-nav',
  			view: 'watchlist_view'
  		}
	},
	{
  		path: '/profile',
  		components: {
  			default: 'app-nav',
  			view: 'profile_view'
  		}
	},
	{
  		path: '/watch-now',
  		components: {
  			default: 'app-nav',
  			view: 'watch_now_view'
  		}
	},
	{
  		path: '/movie/:id',
  		name: 'singleMovieRoute',
  		components: {
  			default: 'app-nav',
  			view: 'single_movie_view'
  		}
	},
	{
  		path: '/people/:id',
  		name: 'peopleView',
  		components: {
  			default: 'app-nav',
  			view: 'people_view'
  		}
	}
]

var router = new VueRouter({
	routes: routes,
});

Vue.filter('makeYear', function (value) {
 	if (!value) return ''
     	var year = value.substring(0, 4);
	return year
});

var app = new Vue({
  	router: router
  }).$mount('#app');