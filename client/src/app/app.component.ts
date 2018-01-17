import { Component , ElementRef, Input, ViewChild} from '@angular/core';
import { Http } from '@angular/http';
import {DndDirective} from './dnd.directive';
import 'rxjs/add/operator/map';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
url='';
pic;
private fileList : any = [];
private invalidFiles : any = [];

//@Input() filefilesChangeEmiter;
@ViewChild('preview') el1:ElementRef;//requires an id

@ViewChild('photo1') ely:ElementRef;
  constructor(private http: Http, private el: ElementRef) {

    }



 onFilesChange(ev){
    // do stuff cons
    this.fileList=ev;
    let formData=new FormData();
    console.log(this.fileList[0]);
     formData.append('photo',this.fileList[0]);
    this.http.post('http://localhost:3000/api/upload',formData).map(res=>res.json()).subscribe((data)=>{
            	console.log(data);
           });

   // console.log(ev);
  }


onInvalid(ev){
this.invalidFiles=ev;
}





     upload() {
      
            //call the angular http method
              let inputEl1: HTMLInputElement = this.ely.nativeElement;//using viewchild decor
             let inputEl2: HTMLInputElement = this.el.nativeElement.querySelector('#photo2');
    //get the total amount of files attached to the file input.
        //let fileCount: number = inputEl1.files.length;

     // console.log(fileCount);
    //create a new fromdata instance
        let formData = new FormData();
        if (true) { // a file was selected
            //append the key name 'photo' with the first file in the element
                formData.append('photo', inputEl1.files.item(0));
                 formData.append('photo', inputEl2.files.item(0));
    console.log(formData);
            this.http.post('http://localhost:3000/api/upload',formData).map(res=>res.json()).subscribe((data)=>{
            	console.log(data);
           });

          }
       }

       fileChangeEvent(fileInput: any){
        this.pic=true;
       	console.log(fileInput.target.files[0]);
      if (fileInput.target.files && fileInput.target.files[0]) {

        var reader = new FileReader();

        reader.onload =  (e : any)=> {//event fires when reader loads any data
           this.url= e.target.result;
           
        }
        reader.readAsDataURL(fileInput.target.files[0]);
        
    }
   }
}
