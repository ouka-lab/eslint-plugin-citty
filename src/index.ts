import { noDuplicatedVersion } from './rules/no-duplicated-version';
import { validVersion } from './rules/valid-version';

export const rules = {
  'no-duplicated-version': noDuplicatedVersion,
  'valid-version': validVersion,
};

export default {
  rules,
};
