const memeModel = (function () {
    const appMasterSecret = 'c14bd698be8f4008a5b23b550e6f2237';
    const listAll = function (data) {
        var authToken = localStorage.getItem("authToken");
        var url = `appdata/${storage.appKey}/memes`
        url += '?query={}&sort={"_kmd.ect": -1}';

        return requester.get(url, '', '')
    };

    const createPost = function (input) {
        let data = {
            'title': input.title,
            'description': input.description,
            'imageUrl': input.imageUrl,
            'creator': localStorage.getItem('username')
        };

        let url = `appdata/${storage.appKey}/memes`;
        return requester.post(url, data, '');
    };

    const getById = function (id) {
        let url = `appdata/${storage.appKey}/memes/${id}`;
        var headers = {};

        headers['Authorization'] = 'Kinvey ' + storage.getData('authToken')
        return requester.get(url, '', headers);
    }

    const getMemesByCreator = function (username) {
        // var authToken = localStorage.getItem("authToken");
        var url = `appdata/${storage.appKey}/memes`
        url += `?query={"creator":"${username}"}&sort={"_kmd.ect": -1}`;
        var headers = {};

        headers['Authorization'] = 'Kinvey ' + storage.getData('authToken')
        return requester.get(url, '', headers)
    }

    const makePutQuery = function (data) {

        let url = `appdata/${storage.appKey}/memes/${data.id.substr(1)}`;
        let headers = {};
        //headers.Authorization = 'Kinvey ' + storage.getData('authToken');
        let obj = {
            'title': data.title,
            "description": data.description,
            "imageUrl": data.imageUrl
        };

        return requester.put(url, obj, headers);
    }

    function showInfo(message) {
        let infoBox = $('#infoBox');
        infoBox.text(message);
        infoBox.show();
        setTimeout(() => infoBox.fadeOut(), 3000);
    };


    const userById = function (id) {
        let url = `user/${storage.appKey}` + `/${id}`;
        var headers = {};
        var authString = btoa(`${storage.appKey}:${appMasterSecret}`);
        var headers = {
            'Authorization': authString
        };

        return requester.get(url, '', headers);
    }

    const deleteMeme = function (id) {
        let url = `appdata/${storage.appKey}/memes/${id}/`;

        headers = {};
        headers.Authorization = 'Kinvey ' + storage.getData('authToken')
        console.log(headers)
        return requester.del(url, '', headers);
    }

    return {
        listAll,
        createPost,
        showInfo,
        getById,
        makePutQuery,
        userById,
        getMemesByCreator,
        deleteMeme,
    }
})();