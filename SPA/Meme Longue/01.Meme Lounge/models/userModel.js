const userModel = (function () {
    var userUrl = `user/${storage.appKey}`;

    const login = function (username, password) {
        var authString = btoa(`${username}:${password}`);
        var headers = {
            Authorization: 'Basic ' + authString
        };

        var data = { username, password };
        var url = userUrl + '/login';

        return requester.post(url, data, headers);
    };

    const logout = function () {
        let url = userUrl + '/_logout';

        return requester.post(url);
    }

    const register = function (params) {
        var data = {
            username: params.username,
            password: params.password,
            email: params.email,
            avatarUrl: params.avatarUrl
        };

        if (params.password !== params.repeatPass) {
            showInfo("passwords must be the same")
        }

        var authString = btoa(`${storage.appKey}:${storage.appSecret}`);
        var headers = {
            'Authorization': 'Basic ' + authString
        };

        return requester.post(userUrl, data, headers)

    };


    const isAuthorized = function () {
        return !!storage.getData('authToken');
    };

    function showInfo(message) {
        let infoBox = $('#infoBox');
        infoBox.text(message);
        infoBox.show();
        setTimeout(() => infoBox.fadeOut(), 3000);
    }

    return {
        login,
        logout,
        register,
        isAuthorized,
        showInfo
    }
}());