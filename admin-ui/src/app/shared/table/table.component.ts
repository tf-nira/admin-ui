import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { Router } from '@angular/router';
import { SortModel } from 'src/app/core/models/sort.model';
import { AppConfigService } from 'src/app/app-config.service';
import * as appConstants from 'src/app/app.constants';
import { CommonService } from 'src/app/core/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { AuditService } from 'src/app/core/services/audit.service';
import { HeaderService } from 'src/app/core/services/header.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {
  @Input() data: [];
  @Input() displayedColumns: [];
  @Input() buttonList: [];
  @Input() sortData: SortModel[];
  @Input() noDataFlag: boolean;
  @Input() showRadioButton: boolean = false;
  @Output() sort = new EventEmitter();
  @Output() selectedCenterDetail = new EventEmitter();
  @Input() isUser = true;
  tableData = [];
  columnsOfTableData = [];
  sortStatusArray: string[] = [];
  currentRoute: string;
  lang: string;
  sortTrackIndex: number;
  sortIconTrackerArray = new Array(15).fill(0);
  ellipsisList = [];
  imageSource: string;

  constructor(
    private router: Router,
    private appConfig: AppConfigService,
    private commonService: CommonService,
    private translate: TranslateService,
    private headerService: HeaderService,
    private auditService: AuditService
  ) {
    let lang = headerService.getUserPreferredLanguage();
   translate.use(lang);
  }
  ngOnInit(): void {
    this.tableData = [...this.data];
    this.sortStatusArray = [];
    this.lang = this.headerService.getUserPreferredLanguage();
    const route = this.router.url.split('/')[3];
    this.imageSource = appConstants.ListViewIdKeyMapping[`${route}`]['imagePath'];
  }

  ngOnChanges(): void {
    this.tableData = [...this.data];
    this.columnsOfTableData = [];
    this.displayedColumns.forEach(column => {
      this.columnsOfTableData.push(column['name']);
    });
    this.setSortDirection();
    if (!this.sortData || this.sortData.length === 0) {
      this.sortIconTrackerArray = new Array(this.displayedColumns.length).fill(0);
    }
  }

  setSortDirection() {
    this.sortIconTrackerArray = new Array(this.displayedColumns.length).fill(0);

    if (this.sortData && this.sortData.length > 0) {
      const data = this.sortData[0];
      const index = this.columnsOfTableData.indexOf(data.sortField);
      if (index !== -1) {
        this.sortIconTrackerArray[index] =
          data.sortType.toLowerCase() === 'asc' ? 1 : -1;
      }
    }
  }

  selectedRow(data: any, specData: any) {
    let currentRouteType = this.router.url.split('/')[3];
    let id = null;
    if(!currentRouteType.includes("view")){
      id = appConstants.ListViewIdKeyMapping[`${currentRouteType}`];
    }else{
      currentRouteType = this.router.url.split('/')[2];
      id = appConstants.ListViewIdKeyMapping[`${currentRouteType}`];
    }
    if (specData.callBackFunction && specData.callBackFunction !== '') {
      if (currentRouteType.toLowerCase() === 'blocklisted-words') {
        this.commonService[specData.callBackFunction]({...data}, specData.redirectURL +"$"+data.langCode, id.idKey);
      }else{
        this.commonService[specData.callBackFunction]({...data}, specData.redirectURL, id.idKey);
      }
    }
  }

  selectedCenter(data: any) {
    this.selectedCenterDetail.emit(data);
  }

  getTableRowData(data: any, index: number, columnName: string) {
    const routeIndex = this.router.url.lastIndexOf('/');
    this.currentRoute = this.router.url.slice(0, routeIndex);
    const currentRouteType = this.router.url.split('/')[3];
    const id = appConstants.ListViewIdKeyMapping[`${currentRouteType}`];

    if(currentRouteType === 'masterdataupload'){
      this.auditService.audit(25, 'ADM-336', currentRouteType);
    }else if(currentRouteType === 'packetupload'){
      this.auditService.audit(25, 'ADM-344', currentRouteType);
    }else{
      this.auditService.audit(7, id.auditEventId, currentRouteType);
    }    
    if (index === 0) {
      if (currentRouteType.toLowerCase() === 'blocklisted-words') {
        this.router.navigate([
          `${this.currentRoute}/single-view`,
          data[id.idKey] + '$' + data.langCode
        ]);
      }else if (currentRouteType.toLowerCase() === 'dynamicfields') {
        this.router.navigate([
          `${this.currentRoute}/single-view`,
          data.fieldVal.code
        ]);
      } else {
        this.router.navigate([
          `${this.currentRoute}/single-view`,
          data[id.idKey]
        ]);
      }
    }
  }

  sortColumn(columnName: string, columnIndex: number) {
    this.auditService.audit(13, 'ADM-093', {
      masterdataName: this.router.url.split('/')[3],
      columnName
    });
    this.sortIconTrackerArray = new Array(this.displayedColumns.length).fill(0);
    let sortType: 'asc' | 'desc' = 'asc';
    const previousSort = this.sortData && this.sortData[0];
    if (previousSort && previousSort.sortField === columnName) {
      sortType = previousSort.sortType.toLowerCase() === 'asc' ? 'desc' : 'asc';
    }
    this.sortIconTrackerArray[columnIndex] = sortType === 'asc' ? 1 : -1;
    const sortModel = new SortModel();
    sortModel.sortField = columnName;
    sortModel.sortType = sortType;
    this.sortData = [sortModel];
    this.sort.emit(sortModel);
  }

  ellipsisAction(data) {
    if (data.isActive === true) {
      // this.ellipsisList = [...this.buttonList];
      this.ellipsisList = JSON.parse(JSON.stringify(this.buttonList));
      if (!this.isUser) {
        // user mapping center menu options
        this.ellipsisList.forEach((values, i) => {
          this.ellipsisList[i] = values.filter(value => {
            return value.buttonName.eng !== 'Activate';
          });
        });
      } else{
        this.ellipsisList = this.ellipsisList.filter(values => {
          return values.buttonName.eng !== 'Activate';
        });
    }
    } else if (data.isActive === false) {
      // this.ellipsisList = [...this.buttonList];
      this.ellipsisList = JSON.parse(JSON.stringify(this.buttonList));
      if (!this.isUser) {
        // user mapping center menu options
        this.ellipsisList.forEach((values, i) => {
          this.ellipsisList[i] = values.filter(value => {
            return value.buttonName.eng !== 'Deactivate';
          });
        });
      } else{
        this.ellipsisList = this.ellipsisList.filter(values => {
            return values.buttonName.eng !== 'Deactivate';
          });
    }
    }else{
      this.ellipsisList = [...this.buttonList];
    }
  }

  tableStyle(index, columnValue, columnName) {
    const myTableStyles = {
      color: '#0F2126',
      cursor: '',
      border: '',
      padding: '',
      borderRadius: '',
      backgroundColor: '',
      whiteSpace: 'nowrap',
      textTransform: '',
      fontSize: ''
    };
    if (index === 0) {
      myTableStyles.color = '#0F2126';
      myTableStyles.cursor = 'pointer';
      return myTableStyles;
    }
    if (columnValue === true && columnName === 'isActive') {
      myTableStyles.color = 'white';
      myTableStyles.fontSize = '7.5px';
      myTableStyles.backgroundColor = '#4AD991';
      myTableStyles.padding = '4px 4px 4px 4px';
      myTableStyles.border = '0.8px solid #68DA7E';
      myTableStyles.borderRadius = '15px';
      myTableStyles.textTransform = 'uppercase';
      return myTableStyles;
    } else if (columnValue === false && columnName === 'isActive') {
      myTableStyles.color = 'white';
      myTableStyles.backgroundColor = '#9C9F9F';
      myTableStyles.fontSize = '7.5px';
      myTableStyles.padding = '4px 4px 4px 4px';
      myTableStyles.border = '0.8px solid #9C9F9F';
      myTableStyles.borderRadius = '20px';
      myTableStyles.textTransform = 'uppercase';
      return myTableStyles;
    }
  }
}
