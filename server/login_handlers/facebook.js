Accounts.onLogin(function(options){

    var user = options.user;

    if (options.type == 'facebook' && user.services.facebook) {

        if (!user.profile.firstName && user.services.facebook.first_name) {
            Meteor.users.update(user._id, {$set: {'profile.firstName': user.services.facebook.first_name}})
        }

        if (!user.profile.lastName && user.services.facebook.last_name) {
            Meteor.users.update(user._id, {$set: {'profile.lastName': user.services.facebook.last_name}})
        }

        if (!user.profile.avatarId && user.services.facebook.id) {
            HTTP.get(
                'https://graph.facebook.com/v2.2/' + user.services.facebook.id + '/picture',
                {
                    params: {
                        redirect: false,
                        height: 800,
                        width: 800
                    }
                },
                function(error, response){
                    var userImage = response.data;
                    if (!userImage.data.is_silhouette) {
                        Images.insert(userImage.data.url, function (error, fileObj) {
                            if (!error) {
                                Meteor.users.update(user._id, {$set: {'profile.avatarId': fileObj._id}})
                            }
                        });
                    }
                }
            );
        }
    }

});
