export function insert(arr, index, newItem) {
    return [
    // part of the array before the specified index
        ...arr.slice(0, index),
        // inserted item
        newItem,
        // part of the array after the specified index
        ...arr.slice(index),
    ];
}
