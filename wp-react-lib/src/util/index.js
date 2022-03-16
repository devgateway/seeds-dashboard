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
            finalUrl = url.replaceAll(all, `/${type}`)
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

    let newHtml = html
    while ((link = regex.exec(html)) !== null) {
        let href = link[2]
        let newLink
        if (useHash) {
            if (href.includes(`/${locale}/`)) {
                newLink = href.replace(all, `#`) //TODO:fix it!
            } else {
                newLink = href.replace(all, `#/${locale}`) //TODO:fix it!
            }
        } else {
            if (href.includes(`/${locale}/`)) {
                newLink = href.replace(all, '') //TODO:fix it!
            } else {
                newLink = href.replace(all, '/' + locale) //TODO:fix it!
            }
        }
        newHtml = newHtml.replaceAll(link[2], newLink)
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


export default { replaceHTMLinks, replaceLink }