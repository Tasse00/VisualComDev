import { globalLoggerStore } from '@/components/Globals';
import { notification } from 'antd';
import React, { useEffect } from 'react';
import { LogRecord, LogStore, useLogs } from '.';

interface Props {
  store: LogStore;
}

const NotifierView: React.FC<Props> = ({ store }) => {
  // const records = useLogs(globalLoggerStore);
  useEffect(() => {
    const cb = (logs: LogRecord[]) => {
      logs
        .filter((log) => log.level !== 'debug')
        .map((log) => {
          // @ts-ignore
          notification[log.level]({
            message: log.logger,
            description: log.message.map((msg) => `${msg}`).join(' '),
            duration: 2,
          });
        });
    };
    store.addCallback(cb);
    return () => {
      store.removeCallback(cb);
    };
  }, [store]);
  return <></>;
};

export default NotifierView;
