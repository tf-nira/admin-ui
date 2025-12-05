import { Component, OnInit, Sanitizer, SecurityContext } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConfigService } from 'src/app/app-config.service';
import { AuditService } from 'src/app/core/services/audit.service';
import { DataStorageService } from 'src/app/core/services/data-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-download-card',
  templateUrl: './download-card.component.html',
  styleUrls: ['./download-card.component.scss']
})
export class DownloadCardComponent implements OnInit {
  data: any;
  showDetails = false;
  showTimeline = false;
  messages: any;
  statusCheck: string;
  searchLimitCount:any;
  searchLimitMaxCount:any;
  id = '';
  error = false;
  errorMessage = '';
  applicantPhoto:any;
  showSubmit = false;
  showDownload = false;
  popupMessages: any;
  subscribed:any;
  NIN: any;
  showNinValue: boolean = false;
  displayNIN: any;   
  constructor(
    private translate: TranslateService,
    private appService: AppConfigService,
    private auditService: AuditService,
    private activatedRoute: ActivatedRoute,
    private dataStorageService: DataStorageService,
    public dialog: MatDialog,
    private sanitizer: Sanitizer,
    private router: Router
  ) {
    translate.use(appService.getConfig().primaryLangCode);
    this.translate
    .getTranslation(this.appService.getConfig().primaryLangCode)
    .subscribe(response => {
      this.popupMessages = response["download-card"].popupMessages;
      this.messages = response['packet-status'];
    });
    this.subscribed = router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
      }
    });
  }

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    let self = this;
    self.auditService.audit(8, 'ADM-045', 'download-card');
    self.getLoginDetails();
  }

  getLoginDetails(){
    let self = this;
    self.auditService.audit(5, 'ADM-045');
    self.dataStorageService.getLoginDetails().subscribe(response => {
      self.searchLimitMaxCount = response["response"]["maxCount"];
      self.searchLimitCount = parseInt(response["response"]["maxCount"]) - parseInt(response["response"]["count"]);
    });  
  }

  captureSelection(selection:string){
    if(selection === 'true'){
      this.showSubmit = false;
      this.showDownload = true;
      this.showNinValue = false;     
    }else{
      this.showSubmit = true;
      this.showDownload = false;
      this.showNinValue = false;      
    }    
  }

  renderImage(){
    this.applicantPhoto = this.sanitizer.sanitize(SecurityContext.URL, this.data.applicantPhoto);
  }  

  search() {    
    this.data = "";
    this.errorMessage = '';
    this.showDownload = false;    
    if (this.id.length !== 29) {
      this.error = true;
    } else {    
      this.dataStorageService.getCardStatus(this.id).subscribe(response => {        
        if (response['response'] != null) {
          this.data = response['response'].applicantDataMap;
          this.NIN = response['response'].applicantDataMap['NIN'];
          this.showDetails = true;
          this.renderImage();
          this.getLoginDetails();
       } else if (response['errors'] != null) {
          this.showErrorPopup(response['errors'][0].message);
        }
      });
    }
  }

  showErrorPopup(errorMessage) {
    this.dialog
      .open(DialogComponent, {
        width: '750px',
        data: {
          case: 'MESSAGE',
          // tslint:disable-next-line:no-string-literal
          title: this.popupMessages['noData']['title'],
          message: errorMessage,
          // tslint:disable-next-line:no-string-literal
          btnTxt: this.popupMessages['noData']['btnTxt']
        },
        disableClose: true
      });
  }

  getNIN(){
    this.displayNIN = this.NIN;
    this.showNinValue = true;
  }

  submit(selection) {  
    if(selection === 'true'){
      this.auditService.audit(21, 'ADM-045', {'type':'download-card','actioned':'Verify and Download'});
      this.dataStorageService
      .downloadCard(this.id).subscribe(
        (data) => {
          var fileName = this.id+".pdf";
          const contentDisposition = data.headers.get('Content-Disposition');
          if (contentDisposition) {
            const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = fileNameRegex.exec(contentDisposition);
            if (matches != null && matches[1]) {
              fileName = matches[1].replace(/['"]/g, '');
            }
          }
          saveAs(data.body, fileName);
        },
        (error: HttpErrorResponse) => {
          const errorJson = JSON.parse(this.blobToString(error.error));
          this.showErrorPopup(errorJson.errors[0].message);
        });
    }else{
      this.auditService.audit(21, 'ADM-045', {'type':'download-card','actioned':'Reject'});
      location.reload();
    }         
  }

  private blobToString(blob): string {
    const url = URL.createObjectURL(blob);
    let xmlRequest = new XMLHttpRequest();
    xmlRequest.open('GET', url, false);
    xmlRequest.send();
    URL.revokeObjectURL(url);
    return xmlRequest.responseText;
  }

  viewMore() {
    this.showTimeline = !this.showTimeline;
  }

  ngOnDestroy() {
    this.subscribed.unsubscribe();
  }
}