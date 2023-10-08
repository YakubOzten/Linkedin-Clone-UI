import { Injectable } from '@angular/core';
import { Role } from 'src/app/auth/models/user.model';
type BannerColors={
  colorOne:string;
  colortwo:string;
  colorthree:string;
}



@Injectable({
  providedIn: 'root'
})
export class BannerColorService {
  bannerColors:BannerColors={
    colorOne:"#a0b4b7",
    colortwo:"#dbe7e9",
    colorthree:"#bfd3d6",
  };

  constructor() { }

  getBannerColors(role:Role):BannerColors{
    switch(role){
     case 'admin':
        return{ colorOne:"#daa520",
        colortwo:"#f0e68c",
        colorthree:"#fafad2",
        };
        case 'premium':
         return{ colorOne:"#bc8f8f",
         colortwo:"#c09999",
         colorthree:"#ddadaf",
         };
         case 'user':
         return{
          colorOne:"#a0b4b7",
          colortwo:"#dbe7e9",
          colorthree:"#bfd3d6",
        };
         
   
     default:
     return this.bannerColors;
    }

 }
}
