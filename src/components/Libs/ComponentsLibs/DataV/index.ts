import Borders from './Borders';
import Decorations from './Decorations';
import Chart from './Chart';
import Background from './Background';

export default {
  lib: {
    guid: 'datav',
    title: 'DataV'
  },
  components: [
    Background,
    ...Borders,
    ...Decorations,
    Chart,
  ]
} as VCD.ComponentLibBundle;
