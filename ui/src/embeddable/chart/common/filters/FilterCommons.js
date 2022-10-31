export const getSortedAndTranslatedArray = (data, intl) => {
    return data.map(d => ({
        value: d,
        translatedLabel: intl.formatMessage({ id: d, defaultMessage: d })
    })).sort((a, b) => a.translatedLabel.localeCompare(b.translatedLabel))
}