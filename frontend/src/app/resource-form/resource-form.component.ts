import { Component, OnInit, AfterContentChecked, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { NamespaceService } from "../services/namespace.service";
import { KubernetesService } from "../services/kubernetes.service";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { Subscription, of } from "rxjs";
import { Volume, Config, SnackType } from "../utils/types";
import { SnackBarService } from "../services/snack-bar.service";
import { getFormDefaults, initFormControls } from "../utils/common";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: "app-resource-form",
  templateUrl: "./resource-form.component.html",
  styleUrls: ["./resource-form.component.scss"]
})
export class ResourceFormComponent implements OnInit, OnDestroy {
  currNamespace = "";
  formCtrl: FormGroup;
  config: Config;

  ephemeral = false;
  defaultStorageclass = false;
  formReady = false;
  pvcs: Volume[] = [];

  subscriptions = new Subscription();

  readonlySpecs: boolean;

  constructor(
    private namespaceService: NamespaceService,
    private k8s: KubernetesService,
    private router: Router,
    private popup: SnackBarService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    // Initialize the form control
    this.formCtrl = getFormDefaults();

    // Update the form Values from the default ones
    this.k8s.getConfig().subscribe(config => {
      if (Object.keys(config).length === 0) {
        // Don't fire on empty config
        return;
      }

      this.config = config;
      initFormControls(this.formCtrl, config);
    });

    // Keep track of the selected namespace
    this.subscriptions.add(
      this.namespaceService.getSelectedNamespace().subscribe(namespace => {
        this.currNamespace = namespace;
        this.formCtrl.controls.namespace.setValue(this.currNamespace);

        // Get the PVCs of the new Namespace
        this.k8s.getVolumes(namespace).subscribe(pvcs => {
          this.pvcs = pvcs;
        });
      })
    );

    // Check if a default StorageClass is set
    this.k8s.getDefaultStorageClass().subscribe(defaultClass => {
      if (defaultClass.length === 0) {
        this.defaultStorageclass = false;
        this.popup.show(
          this.translate.instant("resourceForm.msgDefaultStorageClass"),
          SnackType.Warning,
          0
        );
      } else {
        this.defaultStorageclass = true;
      }
    });
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    // Unsubscriptions
    this.subscriptions.unsubscribe();
  }

  public onSubmit() {
    this.k8s
      .postResource(this.formCtrl.value)
      .pipe(catchError(_ => of("failed")))
      .subscribe(resp => {
        if (resp === "posted") {
          this.router.navigate(["/"]);
        } else if (resp === "failed") {
          // The Notebook wasn't created, but its volumes might have been created
          this.k8s.getVolumes(this.currNamespace).subscribe(pvcs => {
            this.pvcs = pvcs;
          });
        }
      });
  }
  
  // Automatically set values of CPU and Memory if GPU is 1
  checkGPU(gpu: string) {
    if (gpu == "none") {
      this.readonlySpecs = false;
    } else {
      this.readonlySpecs = true;
      this.formCtrl.get("cpu").setValue("5");
      this.formCtrl.get("memory").setValue("96Gi");
    }
  }
}
