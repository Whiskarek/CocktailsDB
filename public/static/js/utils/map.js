export function insertIdInObj(data) {
    return Object.keys(data).map(id => {
        return {...data[id], id: id};
    });
}