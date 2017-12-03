window.onload = function () {
    var CHANNELS = ["kuplinov", "ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp",
        "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];


    console.log('start');
    var requestChannel = function (name_of_channel, element) {

        $.ajax({
            url: 'https://wind-bow.gomix.me/twitch-api/channels/' + name_of_channel,
            dataType: 'jsonp',
            success: function(response) {
                addChannelInfoToElement(response, element);
            }
        });
    };



    var requestStream = function (name_of_channel, element) {
        $.ajax({
            url: 'https://wind-bow.gomix.me/twitch-api/streams/' + name_of_channel,
            dataType: 'jsonp'
            // success: function (response) {
            //     streamInfo = response;
            //     console.log(response);
            //}
        }).done(function (response) {
            addStreamInfoToElement(response, element);
        });
    };


    String.prototype.format = String.prototype.f = function(){
        var args = arguments;
        return this.replace(/\{(\d+)\}/g, function(m,n){
            return args[n] ? args[n] : m;
        });
    };

    var createElement = function () {
        html =
            '<div class="stream-item row align-items-center hide">' +
                '<div class="col-2"><img class="logo" src="#logo#"></div>' +
                '<div class="col-4">' +
                '<a href="#url#" target="_blank"><h2>#name#</h2></a></div>' +
                '<div id="decription" class="col-6"><strong>#game#</strong>: #description#</div>' +
            '</div>';
        var element = document.createElement('div');

        element.innerHTML = html;
        return element.firstChild;
    };



    var addChannelInfoToElement = function(newInfo, element){
        console.log(newInfo);
        var logoUrl = newInfo.logo;
        var url = newInfo.url;
        var name = newInfo.name;
        element.innerHTML = element.innerHTML.replace(/#url#/, url);
        element.innerHTML = element.innerHTML.replace(/#logo#/, logoUrl);
        element.innerHTML = element.innerHTML.replace(/#name#/, name);

        return element;
    };

    var addStreamInfoToElement = function (newInfo, element) {
        var game, videoBanner, description;

        if (newInfo.stream){
            game = (newInfo.stream).game;
            videoBanner = newInfo.stream.channel.video_banner;
            description = newInfo.stream.channel.status;
            element.classList.add('online');

        } else {
            game = 'Ofline';
            description = '';
        }

        element.innerHTML = element.innerHTML.replace(/#game#/, game);
        element.innerHTML = element.innerHTML.replace(/#description#/, description);

        return element;
    };


    var deleteActiveClassFromFilters = function () {
        var filters = document.getElementsByClassName('filters');
        for (var i = 0; i < filters.length; i++){
            filters[i].classList.remove('active');
            }
        };


    var deleteAllHides = function () {
        var items = document.getElementsByClassName('stream-item');
        for (var i = 0; i < items.length; i++){
            console.log(i);
            items[i].classList.remove('hide');
        }
    };

    var showOnlineOnly = function () {
        console.log('showonlineonly');
        deleteAllHides();
        var items = document.getElementsByClassName('stream-item');
        for (var i = 0; i < items.length; i++){
            if (!items[i].classList.contains('online')) {
                items[i].classList.add('hide');
            }
        }
    };

    var showOflineOnly = function () {
        deleteAllHides();
        var items = document.getElementsByClassName('stream-item');
        for (var i = 0; i < items.length; i++){
            if (items[i].classList.contains('online')) {
                items[i].classList.add('hide');
            }
        }
    };

    var showAll = function () {
        deleteAllHides();
    };


    var addFilterEventHandlers = function () {
        var filters = document.getElementsByClassName('filters');
        for (var i = 0; i < filters.length; i++){
            var filter = filters[i];
            filter.onclick = function () {
                deleteActiveClassFromFilters();
                this.classList.add('active');
                console.log(this.id);
                if (this.id === 'online-filter'){
                    console.log('triggered');
                    showOnlineOnly();
                } else if (this.id === 'offline-filter') {
                    console.log('triggered');
                    showOflineOnly();
                } else {
                    showAll();
                }
            }
        }
    };

    var main = function () {
        addFilterEventHandlers();
        for (var i = 0; i < CHANNELS.length; i++){
            var name = CHANNELS[i];
            var element = createElement();
            requestChannel(name, element);
            requestStream(name, element);
            document.getElementById('stream-list').appendChild(element);
        }
        setTimeout(showAll, 700);
    };

    main();


    
};