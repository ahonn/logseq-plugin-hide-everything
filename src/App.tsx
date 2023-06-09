import { Box, Flex, Switch, Text } from '@chakra-ui/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { logseq as plugin } from '../package.json';
import { useDisplaySwitch } from './hook';
import './index.css';

function App() {
  const innerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const recent = useDisplaySwitch('recent', '.recent');
  const favorites = useDisplaySwitch('favorites', '.favorites');
  const bullet = useDisplaySwitch('bullet', '.bullet');
  const scheduledOrDeadlines = useDisplaySwitch(
    'scheduled-or-deadlines',
    '.scheduled-or-deadlines',
  );
  const linkedReferences = useDisplaySwitch(
    'linked-references',
    '.references.page-linked',
  );
  const unlinkedReferences = useDisplaySwitch(
    'unlinked-references',
    '.references.page-unlinked',
  );
  const graphFilters = useDisplaySwitch('graph-filters', '.graph-filters');
  const blockContainer = useDisplaySwitch(
    'blockContainer',
    '.blocks-container',
  );

  const switchs = useMemo(() => {
    return [
      {
        label: 'Hide Rencent',
        switcher: recent,
      },
      {
        label: 'Hide Favorites',
        switcher: favorites,
      },
      {
        label: 'Hide Bullet',
        switcher: bullet,
      },
      {
        label: 'Hide Scheduled And Deadlines',
        switcher: scheduledOrDeadlines,
      },
      {
        label: 'Hide Linked References',
        switcher: linkedReferences,
      },
      {
        label: 'Hide Unlinked References',
        switcher: unlinkedReferences,
      },
      {
        label: 'Hide Graph Filters',
        switcher: graphFilters,
      },
      {
        label: 'Hide Block Container',
        switcher: blockContainer,
      },
    ];
  }, [
    recent,
    favorites,
    bullet,
    scheduledOrDeadlines,
    linkedReferences,
    unlinkedReferences,
    graphFilters,
    blockContainer,
  ]);

  const hiddenEveryThing = useMemo(
    () => switchs.every(({ switcher }) => switcher.hidden),
    [switchs],
  );

  useEffect(() => {
    const eventName = 'ui:visible:changed';
    const listener = ({ visible }: { visible: boolean }) => {
      setVisible(visible);
    };
    logseq.on(eventName, listener);
    return () => {
      logseq.off(eventName, listener);
    };
  });

  const handleClickOutside = (e: React.MouseEvent) => {
    if (!innerRef.current?.contains(e.target as unknown as Node)) {
      window.logseq.hideMainUI();
    }
  };

  return (
    <Box
      height="100vh"
      width="100vw"
      display={visible ? 'block' : 'none'}
      onClick={handleClickOutside}
    >
      <div ref={innerRef} id={plugin.id}>
        <Box
          position="absolute"
          padding={4}
          minWidth={240}
          backgroundColor="gray.50"
        >
          {switchs.map(({ label, switcher }) => {
            return (
              <Flex key={label} alignItems="center" marginBottom={1}>
                <Switch
                  size="sm"
                  marginRight={3}
                  isChecked={switcher.hidden}
                  onChange={switcher.toggle}
                />
                <Text fontSize="sm">{label}</Text>
              </Flex>
            );
          })}
          <Flex alignItems="center" marginBottom={1}>
            <Switch
              size="sm"
              marginRight={3}
              isChecked={hiddenEveryThing}
              onChange={() => {
                switchs.forEach(({ switcher }) =>
                  hiddenEveryThing ? switcher.off() : switcher.on(),
                );
              }}
            />
            <Text fontSize="sm">Hide EveryThing</Text>
          </Flex>
        </Box>
      </div>
    </Box>
  );
}

export default App;
