import React, { useContext } from 'react';
import { ComponentLibContext } from '../ComponentLib/context';
import { globalLoggerStore } from '../Globals';
import PropertyEditor from './PropertyEditor';

const InstanceEditor: React.FC<{
  instance: VCD.ComponentInstance;
}> = props => {
  const { instance } = props;
  return (
    <>
      <PropertyEditor instance={instance} />
    </>

  )
}

export default InstanceEditor;