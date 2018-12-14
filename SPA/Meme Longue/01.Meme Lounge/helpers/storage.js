const storage = function () {
    const appKey = 'kid_BkSYekxlV';
    const appSecret = '799ceda310274507aabaded29c8dcda4';
    const registerToken = 'a2lkX0JrU1lla3hsVjo3OTljZWRhMzEwMjc0NTA3YWFiYWRlZDI5YzhkY2RhNA==';

    const saveData = function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    };

    const getData = function (key) {
        return JSON.parse(localStorage.getItem(key));
    };

    const deleteData = function (key) {
        localStorage.removeItem(key);
    };

    const saveUser = function (data) {
        saveData('userInfo', {
            id: data._id,
            username: data.username,
            password: data.password,
            email: data.email,
            avatarUrl: data.avatarUrl
        });

        saveData('authToken', data._kmd.authtoken);
    };

    const deleteUser = function () {
        deleteData('authToken');
        deleteData('userInfo');
    };

    return {
        saveData,
        getData,
        deleteData,
        appKey,
        appSecret,
        saveUser,
        deleteUser,
        registerToken
    };
}();