import { convertFixtureToJson } from '@codemod-utils/tests';

const inputProject = convertFixtureToJson(
  'my-v2-app-with-translationHelpers/input',
);
const outputProject = convertFixtureToJson(
  'my-v2-app-with-translationHelpers/output',
);

export { inputProject, outputProject };
