import React, { Dispatch, useEffect } from 'react';
import styles from './ContextMenu.less'
import { ContextMenuState, ContextMenuActions } from './index';

interface Props {
    state: ContextMenuState;
    control: Dispatch<ContextMenuActions>
}

function blockDefaultContextMenu(e: any) {/*屏蔽浏览器默认右键事件*/
    e = e || window.event;
    return false;
};

const ContextMenu: React.FC<Props> = props => {

    const {
        visible,
        pos,
        menu,
    } = props.state;

    const style: React.CSSProperties = {
        height: (visible ? undefined : 0),
        left: pos.x,
        top: pos.y,
    }

    document.oncontextmenu = function (e) {/*屏蔽浏览器默认右键事件*/
        e = e || window.event;
        return false;
    };

    useEffect(()=>{
        const origin = document.oncontextmenu;
        // 考虑有多个contextMenu存在的情况 (可能性不高)
        if (origin !== blockDefaultContextMenu) {
            document.oncontextmenu = blockDefaultContextMenu;
            return ()=>{
                document.oncontextmenu = origin;
            }   
        }
    }, []);

    useEffect(()=>{
        const cb = ()=>{
            props.control({
                type: 'close',
                payload: {},
            });
        }
        if (visible) {
            document.addEventListener('click', cb);
            return ()=>{
                document.removeEventListener('click', cb);
            }
        }
        
    }, [visible]);
    
    return (
        <div style={style} className={styles['context-menu']}>
            <div className={styles['context-menu-list']}>
            {
                menu.map(m => (
                    <div key={m.text} className={styles['context-menu-item']} onClick={() => {
                        props.control({
                            type: 'close',
                            payload: {},
                        });
                        m.handler();
                    }}>{m.text}</div>
                ))
            }
            </div>
        </div>
    )

}

export default ContextMenu;