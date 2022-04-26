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
    const extensionsNotToReplace = process.env.REACT_APP_WP_EXTENSIONS.split(",")
    const extensions = new RegExp(`^.*\.(${extensionsNotToReplace.join('|')})$`);
    let newHtml = html
    while ((link = regex.exec(html)) !== null) {
        let href = link[2];
        let newLink
        if (href.includes("Katanga")) {
            debugger
        }
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