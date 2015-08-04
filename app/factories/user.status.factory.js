

app.factory('userStatus', ['$http','$stamplay',function ($http, $stamplay) {
	
	var user = {};
	
	return {
		loginUser: function (data) {
			var loginUser = $stamplay.User().Model;
			return loginUser.login(data.email,data.password)
		},

		registerUser: function (data) {
			var newUser = $stamplay.User().Model;
			return newUser.signup(data)
		},

		logout: function(){
			return $stamplay.User().Model.logout()
		},

		//simple call to get userStatus
		getUserModel: function () {
			return $stamplay.User().Model;
		},

		// Getter and Setter method
		getUser: function () {
			return user
		},
		
		setUser: function (displayName, picture, _id, email, logged) {
			user = {
				displayName: displayName,
				picture: picture,
				_id: _id,
				email: email,
				logged: logged
			}
		}
	};
}])