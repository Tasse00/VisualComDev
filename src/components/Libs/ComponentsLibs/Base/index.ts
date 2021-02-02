import TextConfig from './Text';
import ContainerConfig from './Container';

export default {
  lib: {
    guid: 'base',
    title: 'Base',
  },
  components: [
    TextConfig,
    ContainerConfig,
  ]
} as VCD.ComponentLibBundle;
