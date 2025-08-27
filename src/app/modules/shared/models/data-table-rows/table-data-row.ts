export interface TableDataRow {
  value: string;
  header: string;
  field?: string;
  styles?: {};
  class?: string;
  tdClass?: string;
  thClass?: string;
  concat?: any[];
  getValue?: Function;
  format?: Function;
  get?: () => any;
  set?: (value: any) => void;
}
