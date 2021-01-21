import React from 'react';
import { useEditorHoveredInstance, useEditorInstances } from '../Providers/Editor/hooks';
import InstanceGuid from './DomGuide';

const HoverGuid: React.FC<{

}> = props => {

    const instance = useEditorHoveredInstance();
    const {domMap} = useEditorInstances();
    if (!instance) return null;

    const dom = domMap[instance.guid];
    if (!dom) return null;

    return <InstanceGuid dom={dom} border='1px dashed blue' animation/> 
}

export default HoverGuid;