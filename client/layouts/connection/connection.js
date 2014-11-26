(function(){

    var getSecondsToConnection = function(){
        if (Meteor.status().status === 'waiting') {
            return Math.ceil((Meteor.status().retryTime - (new Date()).getTime()) / 1000);
        } else {
            return 0;
        }
    };

    var secondsToConnection = getSecondsToConnection(),
        secondsToConnectionDep = new Tracker.Dependency;;

    Meteor.setInterval(function(){
        var newSecondsToConnection = getSecondsToConnection();
        if (secondsToConnection != newSecondsToConnection) {
            secondsToConnection = newSecondsToConnection;
            secondsToConnectionDep.changed();
        }
    }, 100);

    Template.connectionInfo.helpers({
        'secondsToConnection': function(){
            secondsToConnectionDep.depend();
            return secondsToConnection;
        }
    });

    Template.connectionInfo.events({
        'click .reconnectBtn': function(e){
            e.preventDefault();
            Meteor.reconnect();
        }
    });

})();
