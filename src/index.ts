import { noDuplicatedVersion } from "./rules/no-duplicated-version";
import { validVersion } from "./rules/valid-version";
import { noMeaninglessValueHint } from "./rules/no-meaningless-value-hint";
import { valueHintCase } from "./rules/value-hint-case";
import { noHiddenRootCommand } from "./rules/no-hidden-root-command";
import { noAliasOnPositional } from "./rules/no-alias-on-positional";
import { enumMustHaveOptions } from "./rules/enum-must-have-options";
import { mustHaveRunOrSubCommands } from "./rules/must-have-run-or-sub-commands";
import { recommendMeta } from "./rules/recommend-meta";
import { noEmptyCommandProperties } from "./rules/no-empty-command-properties";
import { noDefaultOnPositional } from "./rules/no-default-on-positional";
import { aliasShouldBeShort } from "./rules/alias-should-be-short";
import { recommendNameAndDescriptionInArgs } from "./rules/recommend-name-and-description-in-args";
import { sortSubCommands } from "./rules/sort-sub-commands";
import { sortDefineCommandProperties } from "./rules/sort-define-command-properties";
import { groupCommandArgs } from "./rules/group-command-args";

export const rules = {
    "no-duplicated-version": noDuplicatedVersion,
    "valid-version": validVersion,
    "no-meaningless-value-hint": noMeaninglessValueHint,
    "value-hint-case": valueHintCase,
    "no-hidden-root-command": noHiddenRootCommand,
    "no-alias-on-positional": noAliasOnPositional,
    "enum-must-have-options": enumMustHaveOptions,
    "must-have-run-or-sub-commands": mustHaveRunOrSubCommands,
    "recommend-meta": recommendMeta,
    "no-empty-command-properties": noEmptyCommandProperties,
    "no-default-on-positional": noDefaultOnPositional,
    "alias-should-be-short": aliasShouldBeShort,
    "recommend-name-and-description-in-args": recommendNameAndDescriptionInArgs,
    "sort-sub-commands": sortSubCommands,
    "sort-define-command-properties": sortDefineCommandProperties,
    "group-command-args": groupCommandArgs,
};

const configs = {
    recommended: [
        {
            rules: {
                "citty/no-duplicated-version": "error",
                "citty/valid-version": "error",
                "citty/no-meaningless-value-hint": "warn",
                "citty/value-hint-case": "error",
                "citty/no-hidden-root-command": "warn",
                "citty/no-alias-on-positional": "error",
                "citty/enum-must-have-options": "error",
                "citty/must-have-run-or-sub-commands": "error",
                "citty/recommend-meta": "warn",
                "citty/no-empty-command-properties": "warn",
                "citty/no-default-on-positional": "warn",
                "citty/alias-should-be-short": "warn",
                "citty/recommend-name-and-description-in-args": [
                    "warn",
                    { check: ["name", "description"] },
                ],
                "citty/sort-sub-commands": "warn",
                "citty/sort-define-command-properties": "warn",
                "citty/group-command-args": "warn",
            },
        },
    ],
};

export default {
    rules,
    configs,
};
