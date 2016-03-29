function scrape(app) {

    var Article = app.models.Article;
    var Social = app.models.Social;
    var request = require('request');
    var https = require('https');
    var domain = 'https://api.instagram.com/v1/users/';
    var token = '8619424.1fb234f.7269466246614d66b271705b4ec43707';

    var accounts = {
        '433barca': '928132504',
        visubal:'318851835',
        arsenal:'264856197',
        liverpool:'187102427',
        bvb:'604588667',
        'man utd':'491527077',
        thesportbible:'812791281',
        soccerbible: '17381156',
        robgunillustration:'390209727',
        squawka:'432863333',
        bestoffootball:'252687908',
        uefa:'1269788896',
        goalcenter:'273635403',
        rldesignz:'321521655',
        footballnewz:'39157007',
        futbolsport:'689484300'
    }


    function getIgPosts(userId) {
        console.log('IG STARTED');

        request(domain + userId + '/media/recent/?access_token=' + token, function(err, res, body) {
            if (!err) {
                var response = JSON.parse(body).data;
                response.forEach(function(post) {
                    if (!post.caption) {
                        var caption = '';
                    } else {
                        var caption = post.caption.text
                    }

                    var item = {
                        title: caption,
                        link: post.link,
                        name: post.user.username,
                        type: post.type,
                        source: 'ig',
                        thumbnail: post.images.standard_resolution.url,
                        added: post.created_time
                    };

                    if (item.title.length > 48) {
                        item.title = item.title.substr(0, 48) + '...';
                    }

                    Social.create(item, function(err, res) {
                        if (err) {
                            console.log('error:', err.message);
                        } else {
                            console.log('added ig post', res);
                            app.io.emit('socket_media', res);

                        }
                    })

                })

            } else {
                console.log('errrr', err);
            }
        });


    }
    for (var account in accounts){

        getIgPosts(accounts[account]);
    }
}
module.exports = scrape;