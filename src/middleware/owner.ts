import { CommandContext } from 'discord-rose/dist/typings/lib';
import { NonFatalError } from '../lib/NonFatalError'

export default () => {
  return (ctx: CommandContext) => {
    if (!ctx.command.owner) return true;
    if (!['300438546236571658'].includes(ctx.message.author.id)) throw new NonFatalError('You can\'t do this!');
    return true;
  };
}
