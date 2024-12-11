const VERTICAL_OFFSET = 8;
const HORIZONTAL_OFFSET = -3;

const possibleMarkerColors = [
  "#00A7DC",
  "#57CC55",
  "#00A7DC",
  "#57CC55",
  "#00A7DC",
  "#57CC55",
  "#00A7DC",
  "#57CC55",
  "#00A7DC",
  "#57CC55",
];

const countryToColorMap = new Map();
const primaryMarker = "green";

const getColorForCountry = (countryName) => {
  if (!countryName) {
    return primaryMarker;
  }
  if (countryToColorMap.has(countryName)) {
    return countryToColorMap.get(countryName);
  }

  let hash = 0;
  for (let i = 0; i < countryName.length; i++) {
    const char = countryName.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  let index = Math.abs(hash) % possibleMarkerColors.length;
  const originalIndex = index;
  while (
    Array.from(countryToColorMap.values()).includes(possibleMarkerColors[index])
  ) {
    index = (index + 1) % possibleMarkerColors.length;
    if (index === originalIndex) {
      countryToColorMap.set(countryName, primaryMarker);
      return primaryMarker;
    }
  }

  const color = possibleMarkerColors[index];
  countryToColorMap.set(countryName, color);
  return color;
};

export const getMarker = (lat, long, country_name) => {
  const mapLeftBoundary = -180;
  const mapRightBoundary = 180;
  const mapTopBoundary = 90;
  const mapBottomBoundary = -90;

  let xPercentage =
    ((long - mapLeftBoundary) / (mapRightBoundary - mapLeftBoundary)) * 100;
  let yPercentage =
    (1 - (lat - mapBottomBoundary) / (mapTopBoundary - mapBottomBoundary)) *
    100;

  return {
    background: getColorForCountry(country_name),
    left: `${xPercentage + HORIZONTAL_OFFSET}%`,
    top: `${yPercentage + VERTICAL_OFFSET}%`,
  };
};
