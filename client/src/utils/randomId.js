export default () => {
    let num = ''
    let randomNum
    for (let i = 0; i < 6; i++) {
        randomNum = Math.floor(Math.random() * 10)
        num = num + String(randomNum)[0]
    }
    return num
}