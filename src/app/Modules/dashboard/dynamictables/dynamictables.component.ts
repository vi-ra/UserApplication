import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import html2pdf from 'html2pdf.js';
import { MessageService } from 'primeng/api';
import {
  ColDetails,
  Table,
  TableAndColumnDetails,
  TableDetails,
  tableData,
} from 'src/app/Models/table';
import { Constants } from 'src/app/Service/constants';
import { DynamicTableService } from 'src/app/Service/dynamicTable.service';
import { storageService } from 'src/app/Service/storageService';

@Component({
  selector: 'app-dynamictables',
  templateUrl: './dynamictables.component.html',
  styleUrls: ['./dynamictables.component.css'],
})
export class DynamictablesComponent implements OnInit {

  tableData: TableAndColumnDetails[];
  Genders: string[];
  visible: boolean;
  tableName: any;
  tableInstructions: any;
  columns: ColDetails[];
  tableDetails: TableDetails;
  table: Table;
  datatypes: string[];
  Uoms: string[];
  public const: Constants;

  @ViewChild('dataTables') divToPrint: ElementRef;
  addTabeFlg: boolean;
  updateTableFlg: boolean;

  public tableService = inject(DynamicTableService);


  constructor(
    public storageService: storageService,
    private dynamicTableCreator: DynamicTableService,
    public messageService: MessageService
  ) {
    this.Genders = ['Select', 'Male', 'Female'];
  }
  ngAfterViewInit() {}

  ngOnInit(): void {
    this.tableService.getAllTableData().subscribe((data) => {
      this.tableData = data;
      console.log(this.tableData);
    });
    this.visible = false;

    this.addTabeFlg = false;
    this.updateTableFlg = false;

    this.columns = COL_DATA;
    this.Uoms = UOMS;
    this.datatypes = DATA_TYPES;


  }

  toPdf() {
    let variable = { value: this.divToPrint.nativeElement };
    var toPrint = variable.value.innerHTML;

    toPrint =
      '<div style="text-align: center;">Laurel MES Report</div>' + toPrint;

    var newDate = new Date();
    let footer =
      '<div style="text-align: center;">Generated by ' +
      this.storageService.getSessionItem('userName') +
      ' on ' +
      newDate +
      '</div>';
    console.log(toPrint);

    const settings = {
      margin: [5, 10, 2, 10], // Set margins (left, top, right, bottom)
      filename: 'Data Tables.pdf',
      image: { type: 'jpeg', quality: 100 },
      html2canvas: { scale: 2, logging: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }, // Adjust orientation here
      footer: { footer },
    };

    html2pdf().from(toPrint).set(settings).save('example.pdf');

    setTimeout(() => {
      this.ngOnInit();
    }, 200);
  }

  editRow(data: tableData) {
    data.editflag = true;
    console.log(data);
  }
  saveRow(data: tableData, slNo: number, tableNo: number) {
    console.log(data, slNo, tableNo);
  }

  showCreateTableDialog() {
    this.visible = true;
    this.addTabeFlg = true;
    this.columns = [{
      tableId: null,
      serialNo: null,
      columnName: null,
      dataType: null,
      lowerLimit: null,
      upperLimit: null,
      uom: null,
    }];
    this.tableName = '';
    this.tableInstructions = '';
    this.tableDetails = null

  }

  insertColumnAbove(position: number) {
    const col = {
      tableId: null,
      serialNo: null,
      columnName: null,
      dataType: null,
      lowerLimit: null,
      upperLimit: null,
      uom: null,
    };
    this.columns.splice(position, 0, col);
    console.log(this.columns);
  }

  insertColumnBelow(position: number) {
    const col = {
      tableId: null,
      serialNo: null,
      columnName: null,
      dataType: null,
      lowerLimit: null,
      upperLimit: null,
      uom: null,
    };
    this.columns.splice(position+1, 0, col);
    console.log(this.columns);
  }

  removeColumn(position: any) {

    this.columns.splice(position, 1);
    console.log(this.columns);

  }

  SaveTable() {
    this.table = {
      tableDetails: {
        tableId: null,
        tableName: this.tableName,
        tableInstructions: this.tableInstructions,
      },
      colDetails: this.columns,
    };

    this.dynamicTableCreator.CreateTable(this.table).subscribe((data) => {
      if (data) {
        this.messageService.add({
          severity: 'success',
          detail: 'Table Created Sucessfully!',
        });
      }
    });
    this.ngOnInit();
  }

  showEditTableDialog(tableDetails: TableAndColumnDetails) {
    this.visible = true;
    this.updateTableFlg = true;

    this.tableName = tableDetails.tableDetails.tableName;
    this.tableInstructions = tableDetails.tableDetails.tableInstructions;
    this.tableDetails = tableDetails.tableDetails;
    this.columns = tableDetails.colDetails;


  }
  UpdateTable() {
    this.visible = false;
    this.updateTableFlg = false;
  }

}

const COL_DATA = [
  {
    tableId: null,
    serialNo: null,
    columnName: null,
    dataType: null,
    lowerLimit: null,
    upperLimit: null,
    uom: null,
  }
];

const UOMS = [
  'g',
  'mg',
  'ml',
  'lts',
  'kg',
  'Units',
  'No',
  'EA',
  'TS',
  'Bottles',
  '%',
];

const DATA_TYPES = ['int', 'date', 'string', 'gender', 'decimal'];