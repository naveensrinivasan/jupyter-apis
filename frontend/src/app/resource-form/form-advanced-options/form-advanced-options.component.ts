import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: "app-form-advanced-options",
  templateUrl: "./form-advanced-options.component.html",
  styleUrls: [
    "./form-advanced-options.component.scss",
    "../resource-form.component.scss"
  ]
})
export class FormAdvancedOptionsComponent implements OnInit {
  @Input() parentForm: FormGroup;
  languageList = [
    {'id':'en', 'label':'formAdvancedOptions.lblEnglish'},
    {'id':'fr', 'label':'formAdvancedOptions.lblFrench'}    
  ];

  private defaultLang = 'en';
  constructor(private translate: TranslateService) {
    const currentLanguage = this.translate.getDefaultLang();
    this.defaultLang = (currentLanguage != undefined && currentLanguage.match(/en|fr/)) ? currentLanguage : "en";
  }

  ngOnInit() {
    this.parentForm.controls.language.setValue(this.defaultLang);
  }
}
