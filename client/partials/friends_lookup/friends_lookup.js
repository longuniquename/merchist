(function () {

    Template.friendsLookupPartial.events({
        'click .findFacebookFriendsBtn': function(e, template){
            FB.getLoginStatus(
                function(response){
                    if (response.status == 'connected') {
                        FB.api(
                            'me/friends',
                            {
                                limit: 1000
                            },
                            function(response){
                                console.log(response.data);
                            }
                        );
                    }
                }
            );
        }
    });

})();
