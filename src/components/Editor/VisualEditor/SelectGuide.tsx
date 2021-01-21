import React from 'react';
import { useEditorInstances, useEditorSelectedInstance } from '../Providers/Editor/hooks';
import InstanceGuid from './DomGuide';

const SelectGuide: React.FC<{

}> = props => {

    const instance = useEditorSelectedInstance();
    const {domMap} = useEditorInstances();
    if (!instance) return null;

    const dom = domMap[instance.guid];
    if (!dom) return null;

    return <InstanceGuid dom={dom}  border='1px solid blue'/> 
}

export default SelectGuide;