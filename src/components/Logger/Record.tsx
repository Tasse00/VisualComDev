import React from 'react';
import {LogRecord} from '.';
import styles from './index.less';

function p0(s: string|number, len: number =2) {
    s = s.toString();
    while(s.length < len) {
        s = '0'+s
    };
    return s;
}

const Record: React.FC<{

} & LogRecord> = props => {

    const {level, logger} = props;

    const d = new Date(props.timestamp);

    
    const timestamp = `${p0(d.getHours())}:${p0(d.getMinutes())}:${p0(d.getSeconds())}.${p0(d.getMilliseconds(), 3)}`;

    const message = props.message.map(msg=>`${msg}`).join(" ");

    return (
        <div className={styles['record']}> 
            <span className={styles["timestamp"]}>{timestamp}</span>
            <span className={styles[`level-${level}`]}>{level}</span>
            <span className={styles["logger"]}>{logger}</span>
            <span className={styles["message"]}>{message}</span>
        </div>
    )
}

export default Record;