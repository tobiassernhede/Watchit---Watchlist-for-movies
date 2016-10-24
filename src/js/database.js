window.database = {
	getWatchlist: function() {
		if(localStorage.getItem("watchlist")) {
			return JSON.parse(localStorage.getItem("watchlist"));
		} else {
			return [];
		}
	},
	addWatchlist: function(movie) {
		if (localStorage.watchlist) {
			var watchlistData = JSON.parse(localStorage.getItem("watchlist"));
		} else {
			var watchlistData = [];
		}
		var movie_exists = false;
		testing = watchlistData.filter(function (item, index) {
  			if(movie.id == item.id) {
  				movie_exists = index;
  			}
		});
		if(movie_exists !== false) {
			watchlistData.splice(movie_exists, 1);
		} else {
			watchlistData.push(movie);
		}
		localStorage.setItem("watchlist", JSON.stringify(watchlistData));
		return watchlistData;
	},
	getSkipped: function() {
		if(localStorage.getItem("skipped")) {
			return JSON.parse(localStorage.getItem("skipped"));
		} else {
			return [];
		}
	},
	addSkipped: function(movieID) {
		var skippedData = JSON.parse(localStorage.getItem("skipped"));
		var idx = $.inArray(movieID, skippedData);
		if (idx == -1) {
		  skippedData.push(movieID);
		} else {
		  skippedData.splice(idx, 1);
		}
		localStorage.setItem("skipped", JSON.stringify(skippedData));
		return skippedData;
	},
}