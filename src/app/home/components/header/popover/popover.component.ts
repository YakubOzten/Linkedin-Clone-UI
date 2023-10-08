import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';


@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent  implements OnInit,OnDestroy {

  constructor(private authService:AuthService,
    private router:Router,private popoverController:PopoverController) { }

    userFullImagePath:string;
    private userImagePathSubcription:Subscription;
    fullName$=new BehaviorSubject<string>(null);
    fullName='';
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
  async onSignOut(){
     await this.popoverController.dismiss();
      this.authService.logout();
      location.reload();
  }

  ngOnDestroy(): void {
    this.userImagePathSubcription.unsubscribe();
}
}
