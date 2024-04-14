import { FormControl, ValidationErrors } from '@angular/forms';
export class CustomValidators {
    static notOnlyWhitespace(control: FormControl): ValidationErrors {

        // check if string only contains whitespace
        if ((control.value != null) && (control.value.trim().length === 0)) {

            // invalid, return error object
            return { 'notOnlyWhitespace': true };
        }
        else {
            // valid, return empty object
            return {};
        }

    }
}
