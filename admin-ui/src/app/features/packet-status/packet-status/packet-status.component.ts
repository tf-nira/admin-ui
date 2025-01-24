import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConfigService } from 'src/app/app-config.service';
import { AuditService } from 'src/app/core/services/audit.service';
import { DataStorageService } from 'src/app/core/services/data-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from 'src/app/core/services/header.service';

@Component({
  selector: 'app-packet-status',
  templateUrl: './packet-status.component.html',
  styleUrls: ['./packet-status.component.scss']
})
export class PacketStatusComponent implements OnInit {
  data = [
    // {
    //   stageName: 'Virus Scan',
    //   date: '19 Jun 2019',
    //   time: '09:30',
    //   status: 'Completed'
    // }
  ];

  showDetails = false;
  showTimeline = false;
  messages: any;
  statusCheck: string;
  serverMessage:any;
  languageCode:any;

  id = '';
  error = false;
  errorMessage = '';
  constructor(
    private translate: TranslateService,
    private appService: AppConfigService,
    private auditService: AuditService,
    private dataStorageService: DataStorageService,
    private headerService: HeaderService,
    public dialog: MatDialog
  ) {
    this.languageCode = this.headerService.getUserPreferredLanguage();
    translate.use(this.headerService.getUserPreferredLanguage());
    this.translate
    .getTranslation(this.headerService.getUserPreferredLanguage())
    .subscribe(response => {
      console.log(response);
      this.messages = response['packet-status'];
      this.serverMessage = response['serverError'];
    });
  }

  ngOnInit() {
    this.auditService.audit(5, 'ADM-045');
  }

  search() {
    this.data = null;
    this.errorMessage = '';
    if (this.id.length == 0) {
      this.error = true;
    } else {
      this.error = false;
      this.dataStorageService.getPacketStatus(this.id, this.headerService.getUserPreferredLanguage()).subscribe(response => {
        if (response['errors']) {
          this.error = true;
          this.statusCheck = '';
          this.errorMessage = this.serverMessage[response['errors'][0].errorCode];
       } else{          
          this.data = response['response']['packetStatusUpdateList'];
          for (let i = 0 ; i < this.data.length; i++) {
           if (this.data[i].statusCode.includes('FAILED')) {
              this.statusCheck = this.messages.statuscheckFailed;
            } else if(this.data[i].statusCode.includes('REJECTED')) {
              this.statusCheck = this.messages.statuscheckRejected;
            } else if(this.data[i].statusCode.includes('COMPLETED') || this.data[i].statusCode.includes('PROCESSED')) {
              this.statusCheck = this.messages.statuscheckCompleted;
            } else {
              this.statusCheck = this.messages.statuscheckInProgress;
            }
            console.log("status for ", this.data[i].transactionTypeCode, "is ", this.statusCheck);
            this.error = false;
            this.showDetails = true;
          }
          console.log("Final status is ", this.statusCheck)
        }
      });
    }
  }

viewMore() {
    this.showTimeline = !this.showTimeline;
  }
}
