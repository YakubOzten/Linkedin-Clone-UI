import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent  implements OnInit,OnDestroy {
  @ViewChild('form') form!:NgForm;

  @Input() postId?:number;

  userFullImagePath:string;
  private userImagePathSubcription:Subscription;
  fullName$=new BehaviorSubject<string>(null);
  fullName='';
 
  
  constructor(public modalController:ModalController,private authService:AuthService) { }

  ngOnInit() {
    this.userImagePathSubcription=this.authService.userFullImagePath.subscribe(
      (fullImagePath:string)=>{
        // console.log(1,fullImagePath);
      this.userFullImagePath=fullImagePath;
    });
    this.authService.userFullName.pipe(take(1)).subscribe((fullName:string)=>{
      this.fullName=fullName; 
      this.fullName$.next(fullName);
     })

}

  onPost(){
   if(!this.form.valid) return;
   const body=this.form.value['body'];
   this.modalController.dismiss({
    post:{
      body
      
    }
    },'post '
   );
  }
  onDismiss(){
   this.modalController.dismiss(null,'dismiss');
  }
  ngOnDestroy(): void {
    this.userImagePathSubcription.unsubscribe();
  }
}
