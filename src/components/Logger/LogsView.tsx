
import React, { useEffect, useState } from 'react';
import { LogStore, useLogs } from '.';
import styles from './index.less';
import Record from './Record';


const LogsView: React.FC<{
    store: LogStore;
}> = props => {
    const { store } = props;
    const [records] = useLogs(store);

    return (
        <div className={styles['logs-view']}>
            {records.map(rcd => <Record key={rcd.guid} {...rcd} />)}
        </div>
    )
}

export default LogsView;