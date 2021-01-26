import ContainerConfig from '../Base/Container';


const config: VCD.Component = {
  guid: 'datav-bg',
  title: 'Background',
  isContainer: ContainerConfig.isContainer,
  component: ContainerConfig.component,
  properties: JSON.parse(JSON.stringify(ContainerConfig.properties)),
  events: JSON.parse(JSON.stringify(ContainerConfig.events)),
  features: JSON.parse(JSON.stringify(ContainerConfig.features)),
}

function updatePropertyDefault<V=any>(field: string, newDefault: V) {
  if (!config.properties) return;
  const prop = config.properties.find(p=>p.field===field);
  if (!prop) return;
  prop.default = newDefault;
}

updatePropertyDefault('backgroundColor', '#282c34')
updatePropertyDefault<VCD.FieldEditors.AlignmentAttrs>('alignment', {
  flexDirection: 'column',
  alignItems: 'center',
})
updatePropertyDefault<VCD.FieldEditors.BoxSizeAttrs>("boxsize", {
  width: '100%',
  height: '100%',
  paddingTop: "16px",
  paddingBottom: "16px",
  paddingLeft: "16px",
  paddingRight: "16px",
})


export default config;