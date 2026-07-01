import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConfigService } from 'src/app/app-config.service';
import { AuditService } from 'src/app/core/services/audit.service';
import * as appConstants from '../../../app.constants';
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
  showMatchedRid: boolean = false;
  showSendToPerso: boolean = false;
  roles: string[] = [];
  showDetails = false;
  showTimeline = false;
  messages: any;
  statusCheck: string;
  serverMessage:any;
  languageCode:any;
  popupVisible = false;
  popupMessage = '';
  popupTitle = '';
  popupButtonText = 'Done';
  popupType: 'success' | 'message' | 'error' = 'error';
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
    this.roles = this.headerService.getRawRoles();
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
          //this.data = response['response']['packetStatusUpdateList'];
          let allData = response['response']['packetStatusUpdateList'];
          let processedIndex = allData.findIndex(item => item.transactionTypeCode === 'INTERNAL_WORKFLOW_ACTION' &&
            (item.statusCode === 'PROCESSED' || item.statusCode === 'COMPLETED'));
          if (processedIndex !== -1) {
            this.data = allData.slice(0, processedIndex + 1);
          } else {
            this.data = allData;
          }

          let i = this.data.length - 1;
          if (this.data[i].statusCode.includes('FAILED')) {
            this.statusCheck = this.messages.statuscheckFailed;
          } else if(this.data[i].statusCode.includes('REJECTED')) {
            this.statusCheck = this.messages.statuscheckRejected;
          } else if(this.data[i].statusCode.includes('COMPLETED') || this.data[i].statusCode.includes('PROCESSED') || this.data[i].transactionTypeCode.includes('INTERNAL_WORKFLOW_ACTION') && this.data[i].statusCode.includes('SUCCESS')) {
            this.statusCheck = this.messages.statuscheckCompleted;
          } else {
            this.statusCheck = this.messages.statuscheckInProgress;
          }
          console.log("status for ", this.data[i].transactionTypeCode, "is ", this.statusCheck);
          this.error = false;
          this.showDetails = true;
          console.log("Final status is ", this.statusCheck)

          this.showSendToPerso = this.data.some(item =>item.transactionTypeCode === 'PRINT_SERVICE' &&
                item.statusCode === 'PROCESSED' || item.statusCode === 'COMPLETED');

           this.showMatchedRid = this.getShowMatchedRid(this.data);
        }
      });
    }
  }

  getShowMatchedRid(data: any[]): boolean {
    const maList = this.data.filter(item => item.transactionTypeCode === 'MANUAL_ADJUDICATION');
    if (maList.length > 0) {
      const latestMA = maList[maList.length - 1];
      if (latestMA.statusCode === 'SUCCESS') {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  viewMore() {
    this.showTimeline = !this.showTimeline;
  }

  resume() {
    if (!this.id) {
      this.error = true;
      this.errorMessage = 'Invalid packet id';
      return;
    }

    const formData = new FormData();
    formData.append('rid', this.id);
    formData.append('langCode', this.headerService.getUserPreferredLanguage());

    this.dataStorageService.resumePacketProcess(formData).subscribe({
      next: (response) => {
        console.log('Resume API Response:', response);
        this.error = false;
        const res: any = response;
        if (res && res.response && res.response.message && res.response.message == appConstants.Success) {
          this.showPopup('Success', 'Packet Resumed Successfully', 'Close', 'success');
        } else {
          this.showPopup('Error', res.response.message, 'Close', 'error');
        }
      }
    });
  }

  getMatchedRid() {
    if (!this.id) {
      this.error = true;
      this.errorMessage = 'Invalid packet id';
      return;
    }
    this.dataStorageService.getMatchedPacketRid(this.id, this.headerService.getUserPreferredLanguage()).subscribe({
      next: (response) => {
        console.log('Get Matched RID API Response:', response);
        this.error = false;
        const res: any = response;
        let message = res.response.message;
        if (!message[0].startsWith('No') && !message[0].startsWith('Biometric')) {
          let formattedMessage = '';
          if (message[0].startsWith('App')) {
            formattedMessage = message.join('<br>');
          } else {
            formattedMessage = "<b>Matched RID's:</b><br><br>" + message.map(rid => `'${rid}'`).join('<br>');
          }
          this.showPopup('Message', formattedMessage , 'Close', 'message');
        } else {
          this.showPopup('Message', message, 'Close', 'message');
        }
      }
    });
  }
  
  sentToPerso(){
    if (!this.id) {
      this.error = true;
      this.errorMessage = 'Invalid packet id';
      return;
    }

    const formData = new FormData();
    formData.append('rid', this.id);
    formData.append('langCode', this.headerService.getUserPreferredLanguage());

    this.dataStorageService.sentPacketToPerso(formData).subscribe({
      next: (response) => {
        console.log('Sent Packet to Perso API Response:', response);
        this.error = false;
        const res: any = response;
        if (res && res.response && res.response.message) {
          const message = res.response.message;
          if(message.startsWith('Card details sent')){
          this.showPopup('Success', res.response.message, 'Close', 'success');
          } else {
          this.showPopup('Error', res.response.message, 'Close', 'error');
          }
        } 
      }
    });
  }

  showPopup(title: string, message: string, buttonText: string, type: 'success' | 'error' | 'message') {
    this.popupTitle = title;
    this.popupMessage = message;
    this.popupButtonText = buttonText;
    this.popupType = type;
    this.popupVisible = true;
  }

  closePopup() {
    this.popupVisible = false;
  }
}
