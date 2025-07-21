import { Injectable } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class FormService {
  constructor() {}

  generateForm(fields: any[], values: any): FormGroup {
    const form = new FormGroup({});

    fields.forEach((field: any) => {
      form.addControl(field.name, this.createFormControl(field));
    });

    if (values) {
      this.patchFormGroup(form, values);
    }
    return form;
  }

  private createFormControl(field: any): FormControl {
    const validators = this.createValidators(field.validationRules);
    return new FormControl(field.value || "" || null, validators);
  }
  private createValidators(validationRules: { [key: string]: any }) {
    const validators = [];

    if (validationRules["required"]) {
      validators.push(Validators.required);
    }

    if (validationRules["minLength"]) {
      validators.push(Validators.minLength(validationRules["minLength"]));
    }

    if (validationRules["maxLength"]) {
      validators.push(Validators.maxLength(validationRules["maxLength"]));
    }

    if (validationRules["pattern"]) {
      validators.push(Validators.pattern(validationRules["pattern"]));
    }

    if (validationRules["email"]) {
      validators.push(Validators.email);
    }

    if (validationRules["min"]) {
      validators.push(Validators.min(validationRules["min"]));
    }

    if (validationRules["max"]) {
      validators.push(Validators.max(validationRules["max"]));
    }

    if (validationRules["date"]) {
      validators.push(
        Validators.required,
        Validators.pattern(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/)
      );
    }

    return validators;
  }

  patchFormGroup(formGroup: FormGroup, value: any) {
    for (const controlName in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(controlName)) {
        const controlValue = value[controlName];
        if (controlValue !== undefined) {
          const control = formGroup.controls[controlName] as AbstractControl;
          if (control instanceof FormGroup) {
            this.patchFormGroup(control, controlValue);
          } else {
            control.patchValue(controlValue);
          }
        }
      }
    }
  }
}
