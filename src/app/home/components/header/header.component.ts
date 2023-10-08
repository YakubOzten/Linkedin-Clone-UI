import { Component, OnDestroy, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Subscription, take, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ConnectionProfileService } from '../../services/connection-profile.service';
import { FriendRequest } from '../models/FriendRequest';
import { FriendRequestsPopoverComponent } from './friend-requests-popover/friend-requests-popover.component';
import { PopoverComponent } from './popover/popover.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit,OnDestroy {

  constructor(public popoverController:PopoverController,
    private authService:AuthService,
    public connectionProfileService: ConnectionProfileService) { }

  userFullImagePath:string;
  private userImagePathSubcription:Subscription;

   friendRequests:FriendRequest[];
  private friendRequestsSubcription:Subscription;
  

  ngOnInit() {
    this.authService.getUserImageName().pipe(
      take(1),
      tap(({imageName})=>{
        //if(imageName){
          const defaultImagePath ='blank-profile-picture.png';
         // this.authService.updateUserImagePath(imageName).subscribe()
        
        this.authService.updateUserImagePath(imageName||defaultImagePath).subscribe();
        // else{
        //   const defaultImagePath ='blank-profile-picture.png';
        //   this.authService.updateUserImagePath(defaultImagePath).subscribe()
        // }
      })
    ).subscribe();
    this.userImagePathSubcription=this.authService.userFullImagePath.subscribe(
      (fullImagePath:string)=>{
      this.userFullImagePath=fullImagePath;
    });

    this.friendRequestsSubcription=this.connectionProfileService.
    getFriendRequests().subscribe((
      friendRequests:FriendRequest[])=>{
          this.connectionProfileService.friendRequests = friendRequests.filter
          ((friendRequest:FriendRequest)=>
                friendRequest.status==='pending'
          );
      }); 
  }
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      showBackdrop:false,
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async presentFriendRequestPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: FriendRequestsPopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      showBackdrop:false,
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }



  ngOnDestroy(): void {
    this.userImagePathSubcription.unsubscribe();
    this.friendRequestsSubcription.unsubscribe();
}
}
