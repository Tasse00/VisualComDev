// 更新树种所有实例的GUID
function updateSubTreeGuid(
  tree: VCD.ComponentInstanceTree,
  guidMap: { [old: string]: string } = {},
) {
  const newGuid = `${tree.comId}-${Math.random().toString()}`;
  guidMap[tree.guid] = newGuid;
  tree.guid = newGuid;
  tree.children &&
    tree.children.map((child) => updateSubTreeGuid(child, guidMap));
}

// Listener中使用的目标GUID若也在该树中，则更新为对应新值
function updateSubTreeListeners(
  tree: VCD.ComponentInstanceTree,
  guidMap: { [old: string]: string },
) {
  tree.listeners.map((lsn) => {
    if (lsn.target in guidMap) {
      lsn.target = guidMap[lsn.target];
    }
  });
  tree.children &&
    tree.children.map((child) => updateSubTreeListeners(child, guidMap));
}
