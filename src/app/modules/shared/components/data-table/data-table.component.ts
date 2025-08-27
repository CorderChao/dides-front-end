import {
  Component,
  ContentChild,
  ContentChildren,
  Input,
  QueryList,
  SimpleChanges,
  TemplateRef,
} from "@angular/core";
import { UtilityFunctionsService } from "../../services/utility-functions.service";
import { BehaviorSubject, Observable } from "rxjs";
import { FilterByPipe } from "ngx-pipes";
import { sortBy } from "lodash";
import { TableDataRow } from "../../models/data-table-rows/table-data-row";
export interface Params<T> {
  page: T;
  size: T;
  startIndex: number;
  endIndex: number;
  items: T[];
  total: BehaviorSubject<number>;
  totalRecords: number | undefined;
}
@Component({
  selector: "data-table",
  templateUrl: "./data-table.component.html",
  styleUrl: "./data-table.component.scss",
  providers: [FilterByPipe],
})
export class DataTableComponent {
  @Input() columns: TableDataRow[] = [];
  @Input() items: any[] = [];
  @Input() customKeys: any[] = [];

  @Input() params: Params<any> = {
    page: 1,
    size: 10,
    startIndex: 0,
    endIndex: 3,
    totalRecords: 0,
    items: [],
    total: new BehaviorSubject<number>(0),
  };
  @Input() caption: string = "";
  @Input() subTitle: string = "";
  @Input() sort: boolean = false;
  @ContentChild('emptystate') emptyState: TemplateRef<any>;

  templateMap: { [key: string]: TemplateRef<any> } = {}; // Dictionary to map value to template
  @ContentChildren(TemplateRef) templates!: QueryList<TemplateRef<any>>; // Use ContentChildren to get all templates
  @ContentChild("defaultCell") defaultCell!: TemplateRef<any>; // Default cell template

  constructor(
    public utils: UtilityFunctionsService,

    private filterByPipe: FilterByPipe
  ) {}
  keyFilter: any;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (this.columns.length === 0) {
      console.error("This requires at least object specified in Columns input");
    }
  }

  get filterByKeys(): string[] {
    return this.columns.map((column) => column.value);
  }

  operations = (col: TableDataRow, value: any) => {
    if (col && col.format) {
      return col.format(value);
    } else if (col && col.getValue) {
      return col.getValue(value);
    } else {
      return value;
    }
  };

  getCellTemplate(value: string): TemplateRef<any> {
    // This function will be used to get the cell template based on the column value
    return this.templateMap[value] || this.defaultCell;
  }

  generateTemplates() {
    // Exit early if templates array is null or empty
    if (!this.templates || this.templates.length === 0) {
      return; 
    }
    this.templates.forEach((template: any, index) => {
      // Check if the template or its attributes are null
      if (!template || !template["_declarationTContainer"] || !template["_declarationTContainer"].attrs) {
        return; 
      }
      // Extract the template name from the attributes
      const templateName = template["_declarationTContainer"].attrs[1];
      if (templateName) {
        this.templateMap[templateName] = template;
      }
    });
  }

  ngAfterContentInit(): void {
    // Loop through the templates and create the mapping

    this.generateTemplates();
  }

  preparePaginationInfo(items: any[]): void {
    this.params.totalRecords = items.length;
    this.params.total.next(items.length);

    this.params.startIndex = (this.params.page - 1) * this.params.size + 1;
    this.params.endIndex =
      (this.params.page - 1) * this.params.size + this.params.size;
    if (this.params.endIndex > this.params.totalRecords) {
      this.params.endIndex = this.params.totalRecords;
    }

    this.params.items = items.slice(
      this.params.startIndex - 1,
      this.params.endIndex
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes["items"]?.currentValue) {
    }
    this.preparePaginationInfo(this.items);
  }
  get total$() {
    return this.params.total.asObservable();
  }

  filterData(event: any) {
    if (event) {
      let searchTerm = event.target?.value?.trim();
      this.params.items = this.filterByPipe.transform(
        this.items,
        this.filterByKeys,
        searchTerm
      );
      //update pagination
      this.preparePaginationInfo(this.params.items);

      this.params.total.next(this.params.items.length);
    }
  }
  sortBy = (sortBy: string) => {
    this.params.items = this.utils.onSort(sortBy, this.items);
  };
}
