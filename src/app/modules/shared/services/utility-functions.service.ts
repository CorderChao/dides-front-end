import { Injectable } from "@angular/core";
import Swal, { SweetAlertIcon } from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class UtilityFunctionsService {
  constructor() {}

  getColumnValue = (rowData: any, col: any) => {
    if (col?.concat && col?.concat.length > 1) {
      const separatorReg = /[^a-zA-Z0-9\.]/g; // Define pattern for separator matching (any non-word character)
      const values = col.concat?.map((controlName: any) => {
        if (separatorReg.test(controlName)) {
          // Treat string element matching separator pattern as a separator

          return controlName;
        } else {
          // Get value for non-separator elements
          return this.getNestedPropertyValue(rowData, controlName.trim());
        }
      });
      //in some case values might not have been populated data

      const isEmptyArray = values.every((element: any) => element === "");

      if (!isEmptyArray) {
        return values.join(" ");
      } else {
        const isObject =
          col !== undefined && col !== null && col.constructor == Object;
        return this.getNestedPropertyValue(
          rowData,
          isObject ? (col?.field ? col.field : col.value) : col
        );
      }
    } else {
      const isObject =
        !this.isNilOrNaNOrUndefined(col) && col.constructor == Object;
      return this.getNestedPropertyValue(
        rowData,
        isObject ? (col?.field ? col.field : col.value) : col
      );
    }
  };

  getNestedPropertyValue = (obj: any, path: string): any => {
    if (!obj || !path) {
      return;
    }
    const keys = path.split(".");

    for (const key of keys) {
      if (this.isNilOrNaNOrUndefined(obj)) {
        // Check if obj is null or undefined
        return undefined;
      }
      obj = obj[key];
    }

    return obj !== undefined ? obj : "";
  };

  isNilOrNaNOrUndefined = (val: any) =>
    val === null || Number.isNaN(val) || val === undefined || val === "";

  cleanObjects(obj: any) {
    for (var keyName in obj) {
      if (this.isNilOrNaNOrUndefined(obj[keyName])) {
        delete obj[keyName];
      }
    }
    return obj;
  }

  cleanObject(obj: any) {
    for (var keyName in obj) {
      if (this.isNilOrNaNOrUndefined(obj[keyName])) {
        delete obj[keyName];
      }
    }
    return obj;
  }

  confirm = (params: ConfirmAction) => {
    params.showMessage = params.showMessage ?? true;
    params.showTitle = params.showTitle ?? true;
    Swal.fire({
      title: !params.showTitle ? "" : params.title,
      html: !params.showMessage ? "" : params.message,
      icon: params.icon ? params.icon : "info",
      showCancelButton: params.showCancelButton ?? true,
      showConfirmButton: params.showConfirmButton ?? true,
      confirmButtonColor: params.confirmBtnColor ?? "#008080",
      cancelButtonColor: params.cancelBtnColor ?? "#d33000",
      cancelButtonText: params.cancelText ?? "Cancel!",
      confirmButtonText: params.confirmText ?? "Yes!",
    }).then((result: any) => {
      if (result.isConfirmed) {
        if (params.accept) {
          params.accept(params.payload);
        }
      }

      if (result.isDismissed) {
        if (params.reject) {
          params.reject(params.payload);
        }
      }
    });
  };

  onSort(column: any, dataList: any[], direction?: "asc" | "desc") {
    if (direction == "asc") {
      direction = "desc";
    } else {
      direction = "asc";
    }
    const sortedArray = [...dataList]; // Create a new array
    sortedArray.sort((a, b) => {
      const res = this.compare(a[column], b[column]);
      return direction === "asc" ? res : -res;
    });
    return (dataList = sortedArray);
  }
  compare(v1: string | number, v2: string | number) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  getOrdersList(
    counts?: number,
    startPoint?: number,
    keyword?: string,
    type?: "pre" | "suffix"
  ): any[] {
    return [...Array(counts ? counts : 100)].map((_, i) => {
      const orderId = startPoint !== undefined ? i + startPoint : i + 1;
      return {
        id: orderId,
        order: `${keyword ? keyword : "Order#:"}  ${orderId}`,
      };
    });
  }
}

export interface ConfirmAction {
  message: string;
  confirmText?: string;
  title?: string;
  cancelText?: string;
  icon?: SweetAlertIcon;
  confirmBtnColor?: string;
  cancelBtnColor?: string;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  showTitle?: boolean;
  showMessage?: boolean;
  accept?: Function;
  reject?: Function;
  payload?: any;
}
