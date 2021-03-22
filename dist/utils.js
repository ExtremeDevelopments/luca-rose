"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createID = exports.getAvatar = void 0;
function getAvatar(user, type, size) {
    if (user.avatar)
        return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}${type ? '.' + type : ''}${size ? '?size=' + size : ''}`;
    return `https://cdn.discordapp.com/embed/avatars/${BigInt(user.discriminator) % BigInt(5)}.png`;
}
exports.getAvatar = getAvatar;
function createID(length = 16) {
    let result = '';
    const numbers = '123456789';
    for (var i = 0; i < length; i++) {
        result += numbers[Math.floor(Math.random() * numbers.length)];
    }
    return result;
}
exports.createID = createID;
