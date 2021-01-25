declare namespace VCD {
  type ParamsConverter = (...params: any[]) => any[];

  // 组件能够接收的属性定义．对应React组件数据类型的props.
  interface PropertyConfig {
    field: string; // 属性字段
    label?: string; // 显示标签，默认为field
    type: string; // 属性类型，影响输入控件
    default?: any; // 默认值
    params?: any; // 输入控件参数
    desc?: string; // 属性描述
  }

  // 组件能够发出的事件定义．对应React组件的cb类型props.
  interface EventConfig {
    when: string; // 对应prop name
    emit: string; // 事件名称
  }

  // 组件功能定义．对应React组件通过ref暴露的方法
  interface FeatureConfig {
    name: string; // 组件Features内唯一的名称，对应ref暴露的方法
    title?: string; // 描述名称，默认为name
  }

  // 组件
  interface Component<Props = any> {
    guid: string; // 组件全局ID
    title: string; // 组件名称
    component: React.FunctionComponent<Props>;
    isContainer?: boolean; // 是否是容器
    properties?: PropertyConfig[];
    events?: EventConfig[];
    features?: FeatureConfig[];
  }

  // 画布尺寸
  interface EditorSize {
    width: string; // 宽度, css尺寸描述
    height: string; // 高度, css尺寸描述
    allowOverHeight: boolean; // 超过高度的内容是否显示
  }

  // 属性编辑器组件Props名称
  interface PropertyEditorProps<V = any, P = any> {
    value: V;
    update: (newValue: V) => any;
    params: P;
    editors: {
      [type: string]: FieldEditor;
    };
  }

  type PropertyEditorComponent<V, P> = React.FC<PropertyEditorProps<V, P>>;

  // 属性编辑器
  // 不同类型的属性应具备不同的编辑控件，如：文本，文本域，数字，颜色，列表，Options等
  interface FieldEditor {
    type: string; // 属性类型
    component: PropertyEditorComponent<any, any>; // 对应的 React Component
  }

  // 组件实例的监听设置
  interface InstanceListener {
    target: string; // 监听目标ID，默认监听所有实例
    event: string; // 监听的事件
    feature: string; // 监听触发的功能
    converter?: ParamsConverter; // 参数传递时的转换器
  }

  // 组件实例
  interface ComponentInstance {
    guid: string; // 实例ID
    comId: string; // 组件ID

    name: string; // 该实例的显示名称
    properties: {
      // 该实例设置的属性数据
      [field: string]: any;
    };
    listeners: InstanceListener[]; // 组件实例的监听配置
  }

  // 树节点
  interface ComponentInstanceTree extends ComponentInstance {
    children?: ComponentInstanceTree[];
  }

  // EventStore
  type FeatureCallback = (...params: any[]) => any;
  interface InstanceFeature {
    name: string;
    callback: FeatureCallback;
  }

  // Page Store Info
  interface PageStore {
    guid: string; // page guid
    name: string; // page name (root instnace name)
    tree: ComponentInstanceTree;
    timestamp: number; // store timestamp
    size: EditorSize;
  }


  namespace FieldEditors {
    interface AlignmentAttrs {
      flexDirection?: 'column' | 'row';
      justifyContent?:
      | 'flex-start'
      | 'flex-end'
      | 'center'
      | 'space-between'
      | 'space-around';
      alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
      flex?: number;
    }

    interface BoxSizeAttrs {
      width?: string;
      height?: string;
      marginTop?: string;
      marginBottom?: string;
      marginLeft?: string;
      marginRight?: string;
      paddingTop?: string;
      paddingBottom?: string;
      paddingLeft?: string;
      paddingRight?: string;
    }
  }

}
