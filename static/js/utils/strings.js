export function capitalizeFirstLetter([first, ...rest], locale = navigator.language) {
    return [first.toLocaleUpperCase(locale), ...rest].join('');
}

export function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

export function getColorFromString(str) {
    let c = (hashCode(str) & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return '#' + '00000'.substring(0, 6 - c.length) + c;
}