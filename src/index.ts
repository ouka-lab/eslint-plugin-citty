import { noDuplicatedVersion } from './rules/no-duplicated-version';
import { validVersion } from './rules/valid-version';
import { noMeaninglessValueHint } from './rules/no-meaningless-value-hint';

export const rules = {
  'no-duplicated-version': noDuplicatedVersion,
  'valid-version': validVersion,
  'no-meaningless-value-hint': noMeaninglessValueHint,
};

export default {
  rules,
};
