import type { TOC } from '@ember/component/template-only';
import { t } from 'my-v2-app/utils/intl.ts';

interface HelloSignature {
  Args: {};
}

const Hello: TOC<HelloSignature> = <template>
  <h1>{{t "hello.title"}}</h1>
  <p>{{t "hello.message"}}</p>
</template>;

export default Hello;
