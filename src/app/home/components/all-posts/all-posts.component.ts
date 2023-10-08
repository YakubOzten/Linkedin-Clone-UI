import { Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { PostService } from '../../services/post.service';
import { Post } from '../models/Post';
import { ModalComponent } from '../start-post/modal/modal.component';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss'],
})
export class AllPostsComponent  implements OnInit,OnDestroy {
  @ViewChild(IonInfiniteScroll) infiniteScroll!:IonInfiniteScroll;

  @Input()postBody?:string;

  queryParams!: string;
    allLoadedPosts:Post[] = [];
  numberofPosts = 5;
  skipPosts=0;

  private userSubscription:Subscription;

  fullName$=new BehaviorSubject<string>(null);
  fullName='';

  userId$=new BehaviorSubject<number>(null!);

  constructor(private postService:PostService,private authService:AuthService,
     public modalController:ModalController
    ) { }

  ngOnInit() {
    this.getPosts(false,'');
    this.authService.userId.pipe(take(1)).subscribe((userId:number)=>{
      this.userId$.next(userId);
    })
    this.authService.userFullName.pipe(take(1)).subscribe((fullName:string)=>{
      this.fullName=fullName;
      this.fullName$.next(fullName);
     })

      this.userSubscription=this.authService.userStream.subscribe((user:User)=>{
        this.allLoadedPosts.forEach((post:Post,index:number)=> {
          if(user?.imagePath && post.author.id===user.id){
            this.allLoadedPosts[index]['fullImagePath']=
            this.authService.getFullImagePath(user.imagePath);
          }
        })
      })



    //  this.userImagePathSubcription=this.authService.userFullImagePath.subscribe(
    //   (fullImagePath:string)=>{
    //     console.log(1,fullImagePath);
    //   this.userFullImagePath=fullImagePath;
    // })


  }

  ngOnChanges(changes: SimpleChanges) {
    const postBody =changes['postBody'].currentValue;
    if(!postBody) return ;
    this.postService.createPost(postBody).subscribe((post:Post)=>{
      this.authService.userFullImagePath
      .pipe(take(1))
      .subscribe((fullImagePath:string)=>{
        post['fullImagePath']=fullImagePath;
        this.allLoadedPosts.unshift(post);
      });

    });

  }
  getPosts(isInitialLoad:boolean,event:any){
    if(this.skipPosts===20){
      event.target.disabled =true;

    }
    this.queryParams= `?take=${this.numberofPosts}&skip=${this.skipPosts}`;

    this.postService.getSelectedPost(this.queryParams).subscribe
     ((posts:Post[]) =>{
       for(let postIndex =0;postIndex<posts.length;postIndex++){
         const doesAuthorHaveImage=!!posts[postIndex].author.imagePath;
        let fullImagePath =this.authService.getDefaultFullImagePath();
        if(doesAuthorHaveImage){
          fullImagePath=this.authService.getFullImagePath(posts[postIndex].author.imagePath);
        }
        posts[postIndex]['fullImagePath']=fullImagePath;

        this.allLoadedPosts.push(posts[postIndex]);
       }
       if(isInitialLoad) event.target.complete();
       this.skipPosts=this.skipPosts +5;
      });
  }
  
  loadData(event:any){
 this.getPosts(true,event);
  }

 async presentUpdateModal(postId:number){

      const modal=await this.modalController.create({
       component:ModalComponent,
       cssClass: 'my-custom-class2',
       componentProps:{
        postId,
       },
      });
      await modal.present()
      const{data}=await modal.onDidDismiss();
      if(!data) return;

      const newPostBody=data.post.body;
      this.postService.UpdatePost(postId,newPostBody).subscribe(()=>{
        const postIndex=this.allLoadedPosts.findIndex((post:Post)=>post.id===postId);
        this.allLoadedPosts[postIndex].body=newPostBody;
      });

  }



deletePost(postId:number){
  this.postService.deletePost(postId).subscribe(()=>{
    this.allLoadedPosts=this.allLoadedPosts.filter(
      (post:Post)=>post.id !== postId);
  });
}

ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
  }

}
