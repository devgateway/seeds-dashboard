const useHash = process.env.REACT_APP_USE_HASH_LINKS.toLowerCase() === "true"

const getRegExp = (locale) => {
    const replacementTarget = process.env.REACT_APP_WP_HOSTS.split(",")
    return new RegExp(`^(http|https)://(${replacementTarget.join('|')})`, "ig");

}
export const replaceLink = (url, locale, isAddTypeToLink) => {
    let all = getRegExp(locale);
    let type = "";
    if (isAddTypeToLink) {
        type = "type/";
    }
    let finalUrl;
    if (useHash) {
        if (url.includes(`/${locale}/`)) {
            finalUrl = url.replaceAll(all, `/#${type}`);
        } else {
            finalUrl = url.replaceAll(all, `/#/${locale}${type}`);
        }

    } else {
        if (url.includes(`/${locale}/`)) {
            finalUrl = url.replaceAll(all, `${type}`)
        } else {
            finalUrl = url.replaceAll(all, `/${locale}${type}`)
        }
    }
    return finalUrl;
}

export const replaceHTMLinks = (html, locale) => {
    let all = getRegExp(locale);
    let link;
    let regex = /href\s*=\s*(['"])(https?:\/\/.+?)\1/ig;
    const extensionsNotToReplace = process.env.REACT_APP_WP_EXTENSIONS.split(",")
    const extensions = new RegExp(`^.*\.(${extensionsNotToReplace.join('|')})$`);
    let newHtml = html
    while ((link = regex.exec(html)) !== null) {
        let href = link[2];
        let newLink;
        if (extensions.test(href)) {
            newLink = href;
        } else {
            if (useHash) {
                if (href.includes(`/${locale}/`)) {
                    newLink = href.replace(all, `#`);
                } else {
                    newLink = href.replace(all, `#/${locale}`);
                }
            } else {
                if (href.includes(`/${locale}/`)) {
                    newLink = href.replace(all, '');
                } else {
                    newLink = href.replace(all, '/' + locale);
                }
            }
        }
        newHtml = newHtml.replaceAll(link[2], newLink)
    }
    const newRegExp = /href\s*=\s*(['"])([\/].+?)\1/ig;
    let linkSlash;
    while ((linkSlash = newRegExp.exec(html)) !== null) {
        let newHrefSlash = linkSlash[2];
        if (!newHrefSlash.includes(`/${locale}/`)) {
            newHrefSlash = `/${locale}${newHrefSlash}`
        }
        if (useHash) {
            newHrefSlash = `/#${newHrefSlash}`;
        }
        newHtml = newHtml.replaceAll(linkSlash[2], newHrefSlash);
    }
    if (useHash) {
        let anchor = /href="#([^"]*)"/ig;
        let re2 = new RegExp(anchor, "i");
        while ((link = anchor.exec(html)) !== null) {
            let href = link[0]
            let newLink = href.replace(re2, 'href="javascript:document.getElementById(\'' + link[1] + '\').scrollIntoView({block: \'start\', behavior: \'smooth\'})"')
            newHtml = newHtml.replaceAll(link[0], newLink)
        }
    }
    return newHtml;
}
export const getAll = (url, addHeaderInfo, isPreview) => {
    debugger
    const pageSize = isPreview ? 1 : 100;
    let page = 1;
    const returnObject = { data: [] };
    return new Promise((resolve, reject) => {
        return getNextPage(url, page, returnObject, pageSize, addHeaderInfo, isPreview).then(() => {
            if (addHeaderInfo) {
                resolve(returnObject);
            } else {
                resolve(returnObject.data);
            }
        }).catch(err => {
            reject(err);
        });
    });
}

const getNextPage = (url, page, returnObject, pageSize, isPreview) => {
    let union = '?';
    if (url.includes('?')) {
        union = '&';
    }
    return fetch(url + union + 'per_page=' + pageSize + '&page=' + page, { credentials: 'include' }).then((response) => {
        if (response.status !== 200) {
            throw response.toString();
        }
        const meta = {}
        response.headers.forEach((header, name) => {
            meta[name.toLowerCase()] = header

        })

        return response.json().then(function (data_) {
            returnObject.data.push(...data_);
            if (meta['x-wp-totalpages'] && parseInt(meta['x-wp-totalpages']) > page && !isPreview) {
                return getNextPage(url, page + 1, returnObject, pageSize, isPreview);
            }
            //we take the metadata of last fetched page if we end up using this metadata
            //then we need to fix the return object
            //'{"content-type":"application/json; charset=UTF-8",
            // "link":"<https://wp.tasai.dgstg.org/wp-json/>; rel=\\"https://api.w.org/\\"",
            // "x-wp-total":"24",
            // "x-wp-totalpages":"1"}'
            returnObject.meta = meta;
            return;
        })
    });
}

export default { replaceHTMLinks, replaceLink, getAll }
