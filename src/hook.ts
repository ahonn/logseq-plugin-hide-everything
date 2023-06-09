import { useBoolean } from '@chakra-ui/react';
import { useEffect } from 'react';
import { logseq as plugin } from '../package.json';
import toCamelCase from 'to-camel-case';
import Queue from 'queue';

const queue = new Queue({
  autostart: true,
});

export function useDisplaySwitch(name: string, selector: string | string[]) {
  const key = `${toCamelCase(plugin.id)}.${toCamelCase(name)}`;
  const [hidden, { toggle, off, on }] = useBoolean(false);

  useEffect(() => {
    queue.push(async () => {
      const contents = await logseq.Editor.getPage('Contents');
      if (!contents?.properties?.[key]) {
        on();
      }
    });
  }, [key, on]);

  useEffect(() => {
      const sel = Array.isArray(selector) ? selector.join(', ') : selector;
      logseq.provideStyle(`
        ${sel} {
          display: ${hidden ? 'none' : 'block'};
        }
      `);
      queue.push(async () => {
        const contents = await logseq.Editor.getPage('Contents');
        await logseq.Editor.upsertBlockProperty(contents!.uuid, key, hidden);
      });
  }, [hidden, selector, key]);

  return {
    hidden,
    toggle,
    off,
    on,
  };
}
