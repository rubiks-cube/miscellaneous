import { Component, OnInit,Directive} from '@angular/core';
import {  FileDropDirective } from 'ng2-file-upload/file-upload/file-drop.directive';
import {  FileUploader} from 'ng2-file-upload/file-upload/file-uploader.class';

import {  FileUploadModule } from 'ng2-file-upload/file-upload/file-upload.module';
import { FileSelectDirective } from 'ng2-file-upload/file-upload/file-select.directive';
 import {Http} from '@angular/http';
// const URL = '/api/';
const URL = 'http://localhost:3000/api/upload';


@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {

  

   

      public uploader:FileUploader = new FileUploader({url: URL});
  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;
 

  constructor(private http: Http) {
    	
    }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
 
  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }


    onChange(ev:any){

    }

    ngOnInit(){}

}
