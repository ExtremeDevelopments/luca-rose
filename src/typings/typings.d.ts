import { bits } from 'discord-rose/dist/utils/Permissions';
declare module 'discord-rose/dist/typings/lib' {
  interface CommandOptions {
    owner?: boolean;
    disabled?: boolean;
    description?: string;
    category?: string
  }
}