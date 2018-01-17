import { Directive,HostListener,HostBinding,EventEmitter,Output,Input } from '@angular/core';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {
// private filesChangeEmiter : EventEmitter<FileList> = new EventEmitter();
  constructor() { }
@Input() private allowed_extensions : Array<string> = [];//parent to child
 @Output() public filesChangeEmiter : EventEmitter<FileList> = new EventEmitter<FileList>();//child to parent
@Output() public filesInvalidEmiter : EventEmitter<FileList> = new EventEmitter<FileList>();
@HostBinding('style.background') private background;


  @HostListener('dragover', ['$event']) public onDragOver(evt){
  	console.log('pp');
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#999';
  }
  @HostListener('dragleave', ['$event']) public onDragLeave(evt){
  		console.log('pp1');
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
  }
  @HostListener('drop', ['$event']) public onDrop(evt){
  		console.log('pp2');
    evt.preventDefault();
    evt.stopPropagation();
    let files = evt.dataTransfer.files;
    let valid_files : any = [];
    let invalid_files : any = [];
    if(files.length > 0){
     for(let i=0;i<files.length;i++){
     	
        let ext = files[i].name.split('.')[files[i].name.split('.').length - 1];//split the name & extension
        if(this.allowed_extensions.lastIndexOf(ext) != -1){//if present in the array
          valid_files.push(files[i]);
        }else{
          invalid_files.push(files[i]);
        }
      }
      this.filesChangeEmiter.emit(valid_files);
      this.filesInvalidEmiter.emit(invalid_files);
    }
  }
  

}
