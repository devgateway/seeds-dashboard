export const getSortedAndTranslatedArray = (data, intl, firstAtFront) => {

    const translated = data.map(d => {
        // This is a necessary hack because the data is coming empty from the user inputs, IT WONT FIX THE PROBLEM BUT MAKE THE CHART WORK. 
        if (!d) {
            d = Math.random();
        }
        return {
            value: d,
            translatedLabel: intl.formatMessage({id: d, defaultMessage: d})
        };
    });

    if (firstAtFront) {
        return [translated[0], ...translated.slice(1).sort((a, b) => a.translatedLabel.localeCompare(b.translatedLabel))];
    } else {
        return translated.sort((a, b) => a.translatedLabel.localeCompare(b.translatedLabel))
    }

}
