Session.setDefault('marketplaceView:filter', 'all');
Session.setDefault('marketplaceView:sort', {createdAt: -1});
Session.setDefault('marketplaceView:limit', 12);

var findCriteria = function () {
    var criteria = {};
    if (Session.get('marketplaceView:filter') === 'my') {
        criteria.userId = Meteor.userId();
    }
    return criteria;
};

var findOptions = function () {
    return {sort: Session.get('marketplaceView:sort'), limit: Session.get('marketplaceView:limit')};
};

var sub;

Tracker.autorun(function(){
    sub = Meteor.subscribe('products', findOptions());
});

Template.marketplaceView.helpers({
    showAll: function(){
        return Session.get('marketplaceView:filter') === 'all';
    },
    showMy: function(){
        return Session.get('marketplaceView:filter') === 'my';
    },
    ready: function(){
        return sub.ready();
    },
    loading: function(){
        return !sub.ready();
    },
    hasMore: function(){
        return Products.find(findCriteria(), findOptions()).count() === Session.get('marketplaceView:limit');
    },
    products: function(){
        return Products.find(findCriteria(), findOptions());
    }
});

Template.marketplaceView.events({
    'click .btnShowAll': function(){
        Session.set('marketplaceView:filter', 'all');
    },
    'click .btnShowMy': function(){
        Session.set('marketplaceView:filter', 'my');
    },
    'click .btnMore': function(){
        Session.set('marketplaceView:limit', (Math.floor(Products.find(findCriteria(), findOptions()).count() / 12) + 1) * 12);
    }
});
