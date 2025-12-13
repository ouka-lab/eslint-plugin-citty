import { noDuplicatedVersion } from './rules/no-duplicated-version';
import { validVersion } from './rules/valid-version';
import { noMeaninglessValueHint } from './rules/no-meaningless-value-hint';
import { valueHintCase } from './rules/value-hint-case';
import { noHiddenRootCommand } from './rules/no-hidden-root-command';

export const rules = {
  'no-duplicated-version': noDuplicatedVersion,
  'valid-version': validVersion,
  'no-meaningless-value-hint': noMeaninglessValueHint,
  'value-hint-case': valueHintCase,
  'no-hidden-root-command': noHiddenRootCommand,
};

export default {
  rules,
};
