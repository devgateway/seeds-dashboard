export const getTextWidth = (text, font) => {
  // re-use canvas object for better performance
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

export const lightenDarkenColor = (col, amt) => {

  let usePound = false;

  if (col[0] === "#") {
    col = col.slice(1);
    usePound = true;
  }

  const num = parseInt(col, 16);

  let r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  let b = ((num >> 8) & 0x00FF) + amt;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  let g = (num & 0x0000FF) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);

}
export const getSlugFromFilters = (filters, filtersData, valuesFilterStore, selectedFilterStore) => {
  let slug;
  if (filters && filtersData) {
    //TODO add object id (countryId) as parameter
    if (filtersData.get(valuesFilterStore)) {
      const filterSelected = filtersData.get(valuesFilterStore).find(fd => fd.countryId === filters.get(selectedFilterStore));
      if (filterSelected) {
        //TODO add object value (country) as parameter
        slug = filterSelected.country.replace(/\s+/g, '-').toLowerCase();
      }
    }
  }
  return slug;
}