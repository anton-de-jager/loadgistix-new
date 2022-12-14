import { Component, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-insurance',
  templateUrl: './dialog-insurance.component.html',
  styleUrls: ['./dialog-insurance.component.scss']
})
export class DialogInsuranceComponent implements OnInit {
  
  constructor(public dialogRef: MatDialogRef<DialogInsuranceComponent>) { }

  ngOnInit(): void {
  }
  cancel(): void {
    this.dialogRef.close(null);
  }
}
