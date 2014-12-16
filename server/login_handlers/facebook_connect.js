(function () {

    Accounts.registerLoginHandler(function (loginRequest) {
        if (loginRequest.service !== 'facebookConnect') {
            return undefined;
        }

        if (!loginRequest.data || !loginRequest.data.accessToken) {
            throw new Meteor.Error('accessTokenRequired', 'Access token is required')
        }

        var facebookConfig = ServiceConfiguration.configurations.findOne({service: "facebook"});

        if (!facebookConfig || !facebookConfig.appId || !facebookConfig.secret) {
            throw new Meteor.Error('facebookConfigRequired', 'Facebook service is not configured')
        }

        var tokenData = Meteor.wrapAsync(HTTP.get)(
            'https://graph.facebook.com/v2.2/debug_token',
            {
                params: {
                    input_token:  loginRequest.data.accessToken,
                    access_token: facebookConfig.appId + '|' + facebookConfig.secret
                }
            }
        ).data;

        if (!tokenData.data || !tokenData.data.user_id) {
            throw new Meteor.Error('facebookError', 'Facebook error')
        }

        if (tokenData.data.app_id !== facebookConfig.appId || !tokenData.data.is_valid) {
            throw new Meteor.Error('facebookError', 'Facebook access token is invalid')
        }

        var userData = Meteor.wrapAsync(HTTP.get)(
            'https://graph.facebook.com/v2.2/me',
            {
                params: {
                    access_token: loginRequest.data.accessToken
                }
            }
        ).data;

        _.extend(userData, {
            accessToken: loginRequest.data.accessToken,
            expiresAt:   tokenData.data.expires_at
        });

        var userId = null;

        //look for user by facebook ID
        var user = Meteor.users.findOne({'services.facebook.id': userData.id});

        if (!user && userData.email) {
            //look for user by facebook email
            user = Meteor.users.findOne({'emails.address': userData.email, 'emails.verified': true}); //look for only verified emails
        }


        if (!user) {
            //compose new user's model

            //set service data
            var userModel = {
                services: {
                    facebook: userData
                },
                profile:  {},
                emails:   []
            };

            //add email
            if (userData.email) {
                userModel.emails.push({
                    address:  userData.email,
                    verified: false
                });
            }

            //set profile name
            if (userData.first_name) {
                userModel.profile.firstName = userData.first_name;
            }
            if (userData.last_name) {
                userModel.profile.lastName = userData.last_name;
            }
            if (userData.name) {
                userModel.profile.name = userData.name;
            }

            //set gender
            if (userData.gender) {
                switch (userData.gender) {
                    case 'male':
                        userModel.profile.gender = 'male';
                        break;
                    case 'female':
                        userModel.profile.gender = 'female';
                        break;
                }
            }

            //set std locale
            if (userData.locale) {
                userModel.profile.locale = userData.locale.split('_').join('-');
            }

            //insert new user model
            userId = Meteor.users.insert(userModel);
        } else {
            userId = user._id;
            //update service data
            Meteor.users.update(user._id, {$set: {'services.facebook': userData}});
        }

        return {
            userId: userId
        };
    });

})();
