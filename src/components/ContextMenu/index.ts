/**
 * ContextMenu
 * 
 * 全局渲染一个实例
 * 
 * 通过Context提供openContextMenu方法.
 * 同时传递触发对象参数. contextMenu中依据传递的参数提供显示内容及功能.
 */

import { Menu } from 'antd';
import React, { useCallback, useReducer, useContext, Dispatch } from 'react';

interface Pos {
    x: number;
    y: number;
}

interface MenuItem {
    text: string;
    handler: () => any;
}

type OpenFunc = (param: { pos: Pos; menu: MenuItem[]; }) => void;



export interface ContextMenuState {
    visible: boolean;

    pos: Pos;

    menu: MenuItem[];
}


interface ActOpen {
    type: 'open';
    payload: {
        pos: Pos;
        menu: MenuItem[];
    }
}

interface ActClose {
    type: 'close';
    payload: {}
}

export type ContextMenuActions = ActOpen | ActClose;

function reducer(state: ContextMenuState, action: ContextMenuActions): ContextMenuState {
    switch (action.type) {
        case 'open':
            state.menu = action.payload.menu;
            state.pos = action.payload.pos;
            return { ...state, visible: true };
        case 'close':
            state.visible = false;
            return {...state};
        default:
            return state;
    }
}


export function useContextMenu(): [ContextMenuState, Dispatch<ContextMenuActions>] {

    return useReducer(reducer, {
        visible: false,
        pos: { x: 0, y: 0 },
        menu: []
    });
}


export const ContextMenuContext = React.createContext((act: any) => { });


export function useContextMenuTrigger(): [OpenFunc] {
    const dispatch = useContext(ContextMenuContext);
    const openFunc = useCallback((param: { pos: { x: number; y: number; }; menu: MenuItem[]; }) => {
        dispatch({ type: 'open', payload: param })
    }, []);
    return [openFunc];
}