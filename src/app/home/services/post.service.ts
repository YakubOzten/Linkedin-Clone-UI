import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, take, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { environment } from 'src/environments/environment';
import { Post } from '../components/models/Post';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http:HttpClient,private errorHandlerService:ErrorHandlerService) { 
     
  }

  private httpOptions:{headers:HttpHeaders}={
    headers:new HttpHeaders({'Content-Type':'application/json'})
  }

  getSelectedPost(params:string){
      return this.http.get<Post[]>(
        `${environment.baseApiUrl}/feed${params}`).pipe(
          tap((posts:Post[])=>{
              if(posts.length===0) throw new Error('No posts to retreieve');

            
          }),
          catchError(
               this.errorHandlerService.handleError<Post[]>('getSelectedPost',[])
          )
        );
      }
      createPost(body:string){
         return this.http.post<Post>( `${environment.baseApiUrl}/feed`,
         {body},this.httpOptions
         ).pipe(take(1));
      } 
      UpdatePost(postId:number,body:string){
        return this.http.put(`${environment.baseApiUrl}/feed/${postId}`,
        {body},this.httpOptions
        ).pipe(take(1));
     }
     deletePost(postId:number){
      return this.http.delete(`${environment.baseApiUrl}/feed/${postId}`,
      ).pipe(take(1));
   }


}
