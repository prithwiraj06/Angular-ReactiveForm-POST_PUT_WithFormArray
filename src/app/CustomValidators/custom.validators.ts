import { AbstractControl } from '@angular/forms';
export class CustomValidator {
    static checkEmail(domainName: string) {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const emailControlValue: string = control.value;
            const emailDomain = emailControlValue.substring(emailControlValue.lastIndexOf('@') + 1);
            if (emailControlValue === '' || emailDomain === domainName.toLowerCase()) {
                return null;
            } else {
                return { 'invalidEmailDomain': true };
            }
        };
    }
}
