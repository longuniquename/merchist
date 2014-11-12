Template.shopEdit.helpers({
    shop: function() {
        if (this.shopId) {
            return Shops.findOne(this.shopId);
        } else {
            return {};
        }
    }
});

Template.shopEdit.events({
    'submit .shopEditForm': function (e) {
        e.preventDefault();

        var data = {
            title: $('input[name="title"]', e.currentTarget).val(),
            subtitle: $('input[name="subtitle"]', e.currentTarget).val(),
            description: $('textarea[name="description"]', e.currentTarget).val()
        };

        if (!this._id) {
            Router.go('shops.edit', {shopId: Shops.insert(data)});
        } else {
            Shops.update(this._id, {$set: data});
        }
    },
    'change #shopLogo': function (e) {
        var logoFile = e.currentTarget.files[0],
            logoReader = new FileReader(),
            logoImage = new Image();

        logoReader.onload = function (e) {
            logoImage.src = e.target.result;
        };
        logoImage.onload = function() {
            var srcTop = 0,
                srcLeft = 0,
                srcHeight = logoImage.height,
                srcWidth = logoImage.width,
                srcSize;

            if (srcHeight < srcWidth) {
                srcLeft = Math.ceil((srcWidth - srcHeight) / 2);
                srcSize = srcHeight;
            } else if (srcHeight > srcWidth) {
                srcTop = Math.ceil((srcHeight - srcWidth) / 2);
                srcSize = srcWidth;
            }

            var canvas = document.createElement('canvas');
            canvas.setAttribute('height', srcSize + 'px');
            canvas.setAttribute('width', srcSize + 'px');
            var context = canvas.getContext('2d');

            context.beginPath();
            context.arc(srcSize/2,srcSize/2,srcSize/2, 0, 2 * Math.PI, false);
            context.clip();

            context.save();
            context.translate(srcSize/2, srcSize/2);
            context.rotate(0);
            context.drawImage(logoImage, srcLeft, srcTop, srcSize, srcSize, -srcSize/2, -srcSize/2, srcSize, srcSize);
            context.restore();

            document.getElementById('logoImage').src = canvas.toDataURL();
        };
        logoReader.readAsDataURL(logoFile);
    }
});