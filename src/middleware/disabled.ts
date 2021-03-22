import { CommandContext } from 'discord-rose/dist/typings/lib';
import { NonFatalError } from '../lib/NonFatalError'

export default () => {
  return (ctx: CommandContext) => {
    if (ctx.command.disabled) throw new NonFatalError('This command is currently disabled');
    return true;
  };
}
