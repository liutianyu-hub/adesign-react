import React from 'react';

export interface LayoutProps {
  width: number;
}

export interface ColumnProps {
  // 表头单元格自定义样式
  headerCellStyle?: React.CSSProperties;
  // 表身单元格自定义样式
  bodyCellStyle?: React.CSSProperties;
  className?: string;
  align?: 'left' | 'center' | 'right';

  render?: (
    content: React.ReactNode | string, // 返回值
    rowData: any, // 当前行数据
    rowIndex: number // 所在行索引
  ) => React.ReactNode;

  // 表格列名
  title: string;
  // 列数据在数据项中对应的Key
  dataIndex: string;

  // 当前行索引
  rowIndex: number;

  // 当单元格内容为空时，显示占位符，优先级低于 render。
  placeholder?: string;

  rowData: any;

  // 当前列是否允许调整列宽
  enableResize: boolean;
}

export interface RowSelectionProps {
  // 列标题
  columnTitle?: string;

  // 列宽
  columnWidth?: number;

  // 已选中的key数组
  selectedRowKeys?: string[];

  // 选择框类型 目前支持多选，后期加单选支持
  type?: 'checkbox';

  // 选中项发生变化时的回调
  onSelectChange?: (selectedRowKeys: string[], selectedRows: any[]) => void;

  // 用户手动选择/取消选择所有行的回调
  onSelectAll?: (selected: boolean, selectedRows: any[]) => void;
}

export interface RowProps {
  key?: string | number;

  rowIndex?: number;

  // 当前行数据
  rowData?: any;

  // 列描述数据对象的数组
  columns?: any[];

  rowKey: string;

  // 配置表格行是否可选，选中事件等
  rowSelection?: RowSelectionProps | undefined;

  // 选中项发生变化时的回调
  onSelectChange?: (status: any, rowKey: string) => void;
}

export interface TableProps {
  data: any[];
  style?: React.CSSProperties;
  className?: string | string[];

  // 是否显示边框
  showBorder?: boolean;

  // 列描述数据对象的数组
  columns: any[];

  // 配置表格行是否可选，选中事件等
  rowSelection?: RowSelectionProps | undefined;

  // 表格行 key 的取值字段
  rowKey?: string;

  // 是否显示表头
  showHeader?: boolean;

  // 无数据时展示内容
  noDataElement?: React.ReactNode;

  // 表格下各列默认宽高
  layouts?: LayoutProps;

  // 调整表格列宽后回调事件
  onLayoutsChange?: (newLayout: any) => void;

  // 自定义表格行
  renderRow?: (node: React.ReactNode) => React.ReactNode;

  // 表格内数据变化时回调
  onChange?: (newData: any) => void;
}

export interface SplitBarProps {
  layout: LayoutProps;
  tableHeight: number;
  onLayoutChange: (layout: LayoutProps) => void;
}
