export const getSortedAndTranslatedArray = (data, intl, firstAtFront) => {

    const translated = data.map(d => ({
        value: d,
        translatedLabel: intl.formatMessage({id: d, defaultMessage: d})
    }));


    if (firstAtFront) {
        return [translated[0], ...translated.slice(1).sort((a, b) => a.translatedLabel.localeCompare(b.translatedLabel))];
    } else {
        return translated.sort((a, b) => a.translatedLabel.localeCompare(b.translatedLabel))
    }

}