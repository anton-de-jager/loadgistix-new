import { Component, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tc',
  templateUrl: './dialog-tc.component.html',
  styleUrls: ['./dialog-tc.component.scss']
})
export class DialogTcComponent implements OnInit {
  
  constructor(public dialogRef: MatDialogRef<DialogTcComponent>) { }

  ngOnInit(): void {
  }
  cancel(): void {
    this.dialogRef.close(null);
  }
}
