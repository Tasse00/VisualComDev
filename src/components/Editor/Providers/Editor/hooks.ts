import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  EditorContainerContext,
  EditorSelectedInstanceContext,
  EditorDispatcherContext,
  EditorHoveredInstanceContext,
  EditorInstancesContext,
  EditorHistoryContext,
  EditorRootInstanceContext
} from './context';

/****** UTILS */
export function useEditor() {
  const dispatch = useContext(EditorDispatcherContext);

  return dispatch;
}

// 获取当前节点树
export function useEditorInstances() {
  return useContext(EditorInstancesContext);
}

// 获取当前选中的Instance
export function useEditorSelectedInstance(): VCD.ComponentInstance | undefined {
  const instance = useContext(EditorSelectedInstanceContext);
  return instance;
}

// 获取当前悬浮的Instance
export function useEditorHoveredInstance() {
  const instance = useContext(EditorHoveredInstanceContext);
  return instance;
}

// 获取Container的Attribs
export function useEditorContainerAttribs() {
  return useContext(EditorContainerContext);
}

export function useEditorHistory() {
  return useContext(EditorHistoryContext);
}


function storeLocal(stores: VCD.PageStore[]) {
  window.localStorage.setItem('page-stores', JSON.stringify(stores));
}
function retrieveLocal(): VCD.PageStore[] {
  try {
    return JSON.parse(window.localStorage.getItem('page-stores') || '')
  } catch (e) {
    console.warn("pagestores in localstorage is invalid")
    return [];
  }
}

// 获取保存在本地的页面
export function useStoredPages(): {
  stores: VCD.PageStore[];
  remove: (pageStoreId: string) => void;
  add: (pageStore: VCD.PageStore) => string;
  update: (pageStoreId: string, pageStore: VCD.PageStore) => string;
} {
  const [stores, setStores] = useState<VCD.PageStore[]>([]);

  useEffect(() => {
    setStores(retrieveLocal());
  }, []);

  const remove = useCallback((id: string) => {
    const idx = stores.findIndex(s => s.guid === id);
    if (idx > -1) {
      stores.splice(idx, 1);
      const newStore = [...stores];
      setStores(newStore);
      storeLocal(newStore)
    }
  }, [stores, setStores]);

  const add = useCallback((store: VCD.PageStore) => {
    const idx = stores.findIndex(s => s.guid === store.guid);
    if (idx > -1) {
      return 'PageStore Existed';
    }
    const newStore = [store, ...stores];
    setStores(newStore);
    storeLocal(newStore)
    return '';
  }, [stores, setStores]);

  const update = useCallback((id: string, store: VCD.PageStore) => {
    const idx = stores.findIndex(s => s.guid === id);
    if (idx===-1) {
      return 'PageStore Not Existed';
    }
    stores[idx] = { ...stores[idx], ...store };
    const newStore = [...stores];
    setStores(newStore);
    storeLocal(newStore)

    return '';
  }, [stores, setStores]);

  return {
    stores,
    remove, add, update
  }
}

export function useRootInstance() {
  return useContext(EditorRootInstanceContext);
}