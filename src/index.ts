import { noDuplicatedVersion } from './rules/no-duplicated-version';
import { validVersion } from './rules/valid-version';
import { noMeaninglessValueHint } from './rules/no-meaningless-value-hint';
import { valueHintCase } from './rules/value-hint-case';
import { noHiddenRootCommand } from './rules/no-hidden-root-command';
import { noAliasOnPositional } from './rules/no-alias-on-positional';
import { enumMustHaveOptions } from './rules/enum-must-have-options';
import { mustHaveRunOrSubCommands } from './rules/must-have-run-or-sub-commands';

export const rules = {
  'no-duplicated-version': noDuplicatedVersion,
  'valid-version': validVersion,
  'no-meaningless-value-hint': noMeaninglessValueHint,
  'value-hint-case': valueHintCase,
  'no-hidden-root-command': noHiddenRootCommand,
  'no-alias-on-positional': noAliasOnPositional,
  'enum-must-have-options': enumMustHaveOptions,
  'must-have-run-or-sub-commands': mustHaveRunOrSubCommands,
};

export default {
  rules,
};
