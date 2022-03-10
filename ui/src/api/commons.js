export const post = (url, params, isBlob) => {

    return new Promise((resolve, reject) => {
        fetch(url, {

            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(params)
        })
            .then(
                function (response) {
                    if (response.status !== 200) {
                        reject(response)
                    }
                    if (isBlob) {
                        resolve(response.blob())
                    }
                    response.json().then(function (data) {
                        resolve(data)
                    }).catch(() => resolve(response.status))
                }
            )
            .catch(function (err) {
                reject(err)
            })
    })
}
export const get = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        fetch(url,)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        reject(response)
                    }
                    response.json().then(function (data) {
                        resolve(data)
                    })
                }
            )
            .catch(function (err) {
                reject(err)
            })
    })
}

export const getAll = (url) => {
    const pageSize = 100;
    let page = 1;
    let data = [];
    return new Promise((resolve, reject) => {
        return getNextPage(url, page, data, pageSize).then(() => {
            resolve(data)
        }).catch(err => {
            console.error(err);
            reject(err);
        });
    });
}

const getNextPage = (url, page, data, pageSize) => {
    return fetch(url + '?per_page=' + pageSize + '&page=' + page).then((response) => {
        if (response.status !== 200) {
            throw response.toString();
        }
        return response.json().then(function (data_) {
            data.push(...data_);
            if (data_.length === pageSize) {
                return getNextPage(url, page + 1, data, pageSize);
            }
            return;
        })
    });
}

export const queryParams = (params) => {
    return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&')
}


