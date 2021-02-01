import Switch from './Switch';
import Lamp from './Lamp';

export default {
  lib: {
    guid: 'demo',
    title: 'Demo',
  },
  components: [
    Switch, Lamp,
  ]
} as VCD.ComponentLibBundle;