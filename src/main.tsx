import '@logseq/libs';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { logseq as plugin } from '../package.json';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';

async function openPanel() {
  const rect = await logseq.App.queryElementRect('#' + plugin.id);
  const panel = document.querySelector('#' + plugin.id)!;

  // @ts-ignore
  Object.assign(panel.style, {
    position: 'fixed',
    // @ts-ignore
    top: `${rect.top + 40}px`,
    // @ts-ignore
    left: rect.left + 'px',
  });

  logseq.showMainUI();
}

function createModel() {
  return {
    openPanel,
  };
}

function main() {
  logseq.setMainUIInlineStyle({
    position: 'fixed',
    zIndex: 11,
  });

  logseq.App.registerUIItem('toolbar', {
    key: plugin.id,
    template: `
        <a id="${plugin.id}" data-on-click="openPanel" data-rect class="button">
          <i class="ti ti-eraser" style="font-size: 20px"></i>
        </a>
      `,
  });

  const root = ReactDOM.createRoot(document.getElementById('app')!);
  root.render(
    <React.StrictMode>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </React.StrictMode>,
  );
}

logseq.ready(createModel()).then(main).catch(console.error);
