import { APIUser } from "discord-api-types";

/**
 * Get the user's avatar
 * @param user The user to get the avatar from
 * @param user The user
 * @param type The type of image
 * @param size The size of the image
 */
export function getAvatar(user: APIUser, type?: string | null, size?: number | null) {
  if (user.avatar) return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}${type ? '.' + type : ''}${size ? '?size=' + size : ''}`;
  return `https://cdn.discordapp.com/embed/avatars/${BigInt(user.discriminator) % BigInt(5)}.png`;
}

export function createID(length: number = 16) {
  let result: string = '';
  const numbers = '123456789';
  for (var i: number = 0; i < length; i++) {
    result += numbers[Math.floor(Math.random() * numbers.length)];
  }
  return result;
}