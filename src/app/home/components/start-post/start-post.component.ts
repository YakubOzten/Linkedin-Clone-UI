import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-start-post',
  templateUrl: './start-post.component.html',
  styleUrls: ['./start-post.component.scss'],
})
export class StartPostComponent  implements OnInit,OnDestroy {
 @Output() create:EventEmitter<any> = new EventEmitter();

 userFullImagePath:string;
 private userImagePathSubcription:Subscription;


  constructor(public modalController:ModalController,private authService:AuthService) { }

  ngOnInit() {
    this.userImagePathSubcription=this.authService.userFullImagePath.subscribe(
      (fullImagePath:string)=>{
        // console.log(1,fullImagePath);
      this.userFullImagePath=fullImagePath;
    });
  }

  async presentModal(){
     const modal=await this.modalController.create({
      component:ModalComponent,
      cssClass: 'my-custom-class2'
     })
     await modal.present()
     const{data}=await modal.onDidDismiss();
     if(!data) return;  
   
     this.create.emit(data.post.body);
  }

  ngOnDestroy(): void {
        this.userImagePathSubcription.unsubscribe();
  }

}
