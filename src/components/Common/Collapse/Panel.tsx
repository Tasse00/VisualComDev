import React from 'react';
import { useCollapse } from '.';
import styles from './Panel.less';

const Panel: React.FC<{
  id: string;
  title: string | React.ReactNode;
}> = props => {
  const { id, title } = props;
  const { isOpened, open, close } = useCollapse();
  const ref = React.useRef<HTMLDivElement>(null);
  const opened = isOpened(id);

  const realHeight = ref.current ? ref.current.scrollHeight : 0;

  return (
    <div className={styles['panel']}>
      <div className={styles['header']} onClick={() => { opened ? close(id) : open(id) }}>
        <div>{title}</div>
        <div>
          <svg viewBox="64 64 896 896" focusable="false" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true" style={{ transform: opened ? 'rotate(90deg)' : undefined }}>
            <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z" />
          </svg>
        </div>
      </div>
      <div className={styles['body']} ref={ref} style={{
        height: !opened ? 0 : realHeight,
      }}>
        <div>
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default Panel;