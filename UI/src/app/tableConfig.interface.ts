export interface TableConfig {
    tableId: string;
    tableName: string;
    dataKey?: string;
    isLazyLoad?: boolean;
    isMultiSelect?: boolean;
    multiSelectColStyle?: object;
    columns: ColumnConfig[];
    data: any[];
  }

  export interface ColumnConfig {
    fieldName: string;
    columnTitle?: string;
    columnStyle?: object;
    isFilterable?: boolean;
    isEditable?: boolean;
    isSortable?: boolean;
    isEditableAsText?: boolean;
    isEditableAsDropDown?: boolean;
    editFieldStyle?: object;
    editDropDownOptions?: EditColumnOptions[];
  }
  
  export interface EditColumnOptions {
    id: string;
    value: string;
  }
  