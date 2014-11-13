Meteor.methods({
    saveImage: function (dataURL) {

        var fs = Meteor.npmRequire('fs'),
            path = Meteor.npmRequire('path'),
            regex = /^data:.+\/(.+);base64,(.*)$/,
            matches = dataURL.match(regex),
            ext = matches[1],
            data = matches[2],
            uploadsDir = path.join(process.env.PWD, 'public', 'uploads');

        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
        }

        var buffer = new Buffer(data, 'base64');

        fs.writeFileSync(path.join(uploadsDir, 'data.' + ext), buffer);

        return '/uploads/data.' + ext;
    }
});