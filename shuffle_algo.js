function random(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

function shuffleArray (array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

let shuffle = (arr = []) => {
    shuffleArray(arr)
    let step = random(1, arr.length - 1)

    let retrieversArr = [...arr.slice(step, arr.length)]
    retrieversArr = retrieversArr.concat(arr.slice(0, step))

    return retrieversArr
}

module.exports = {
    shuffle
}