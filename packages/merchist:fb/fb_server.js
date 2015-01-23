Meteor.methods({
    'FbApi:action:sell': function (productId) {
        var facebookConfig = ServiceConfiguration.configurations.findOne({service: 'facebook'});

        if (!Meteor.user()) {
            throw new Meteor.Error('not-authorized', 'User is not authorized');
        }

        if (!Meteor.user().services || !Meteor.user().services.facebook) {
            throw new Meteor.Error('not-authorized-facebook', 'User is not authorized with facebook');
        }

        var product = Products.findOne(productId);

        if (!product) {
            throw new Meteor.Error('not-found', 'Product does not exist');
        }

        if (product.userId !== Meteor.userId()) {
            throw new Meteor.Error('not-allowed', 'Product does not belong to user');
        }

        var actionData = {
            product:                Meteor.absoluteUrl('products/' + productId),
            'fb:explicitly_shared': true,
            start_time:             product.createdAt.toISOString(),
            expires_in:             60 * 60 * 24 * 356 * 100,
            scrape:                 true
        };

        /*
         var images = Images.find({_id: {$in: product.imageIds}});

         if (images.count()) {
         images.forEach(function (image, index) {
         actionData['image[' + index + '][url]'] = Meteor.absoluteUrl(image.url({
         store:    'xl',
         auth:     false,
         download: true
         }).replace(/^\/+/, ''));
         actionData['image[' + index + '][user_generated]'] = true;
         });
         }
         */

        actionData.access_token = facebookConfig.appId + '|' + facebookConfig.secret;

        try {
            var response = Meteor.wrapAsync(HTTP.post)(
                'https://graph.facebook.com/v2.2/' + Meteor.user().services.facebook.id + '/' + facebookConfig.namespace + ':sell',
                {
                    params: actionData
                }
            );
        } catch (e) {
            console.error(e);
            throw new Meteor.Error('facebook_error', 'Facebook error');
        }

        if (!response.data || !response.data.id) {
            throw new Meteor.Error('facebook_error', 'Facebook error');
        }

        Products.update(product._id, {$set: {'facebookStories.sell': response.data.id}});
        return true;
    }
});
