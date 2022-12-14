import { Component, EventEmitter, OnInit, AfterViewInit, Inject, HostListener } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-directory-detail',
  templateUrl: './dialog-directory-detail.component.html',
  styleUrls: ['./dialog-directory-detail.component.scss']
})
export class DialogDirectoryDetailComponent implements OnInit {
  timestamp: number = 0;
  imagesFolder = environment.api + 'Images/';
  directoryItem: any;
  screenSize: number = window.innerWidth;

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogDirectoryDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.timestamp = new Date().getTime();
    this.directoryItem = data.directoryItem
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenSize = window.innerWidth;
  }

  getAddressSubstring(str: string, char: string) {
    let arr = str.split(char);
    return arr.length > 1 ? arr[0] + ',' + arr[1] : str;
  }

  ngOnInit(): void {
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  navigateExternal(event:Event, url) {
    event.preventDefault();
    if (Capacitor.isNativePlatform) {
        Browser.open({ url });
    }else{
        window.open(url, '_blank');
    }
  }
}
