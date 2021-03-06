import { Component, ElementRef, OnInit, Renderer2, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AlertService } from '../services/alertservice/alert-service.service';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth/authservice.service';
import { StorageService } from '../services/auth/storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild("myTopnav", { static: false }) topnav: ElementRef;
  @ViewChild("sidenav", { static: false }) sidenav: ElementRef;
  @ViewChild('profile') profile: ElementRef;
  @ViewChild('profilebtn') profilebtn: ElementRef;
  
  profileopened$=new BehaviorSubject<boolean>(false);

  isloggedin: any

  constructor(
    private router: Router, 
    private authservice: AuthService,
    private storageService:StorageService,
    private apiservice:ApiService,
    private alertservice:AlertService,
    private renderer1: Renderer2,
    private cd: ChangeDetectorRef
    ) {
    }

  startlistenForProfile(){
    this.renderer1.listen('window', 'click',(e:Event)=>{
      // console.log(e.target)
      if(this.openprofile == true){
        if(!this.profilebtn.nativeElement.contains(e.target) && !this.profile.nativeElement.contains(e.target)) {
          this.openprofile=false;
          }
      }
    });
  }

  opened= true;
  advertisements=false;
  liveview=true;
  b_intelli = false;
  alarms = false;
  showLoader=false;
  openprofile=false;
  editpro=false;
  newpass=false;

  ngOnInit(): void {  
    this.check();
    this.data = this.storageService.getEncrData('user');
    var services = JSON.parse(localStorage.getItem('siteservices')!);
    if(services){
      this.getsiteservices();
    }
  }
  data:any;
  ngAfterViewInit(){
    this.getsiteservices();
    this.startlistenForProfile()
  }

  getsiteservices(){
    this.apiservice.siteservices$.subscribe((res:any)=>{
      // setTimeout(()=>{
        // if(res.Status != "Failed" && res.Services){
        //   console.log('again', servs)
        //   var servs = res.Services;
        //   if(servs.LiveView == 'F'){this.liveview = false}else{this.liveview = true};
        //   if(servs.advertising == 'F'){this.advertisements = false}else{this.advertisements = true};
        //   if(servs.business_intelligence == 'F'){this.b_intelli = false}else{this.b_intelli = true};
        //   if(servs.alarms == 'F'){this.alarms = false}else{this.alarms = true}
        // }else{
        var services = JSON.parse(localStorage.getItem('siteservices')!);
        if(services){
          if(services.Status != "Failed"){
            // console.log(services)
            var servs= services.Services;
            if(servs.LiveView == 'F'){this.liveview = false}else{this.liveview = true};
            if(servs.advertising == 'F'){this.advertisements = false}else{this.advertisements = true};
            if(servs.business_intelligence == 'F'){this.b_intelli = false}else{this.b_intelli = true};
            if(servs.alarms == 'F'){this.alarms = false}else{this.alarms = true}
            this.cd.detectChanges();
          }else{
            this.advertisements=false;
            this.b_intelli = false;
            this.alarms = false;
          }
        }
        // }
      // },200)
    
    })
  }


  check(){
  var x = this.authservice.getAuthStatus();
    if(x == false){
      this.authservice.logout();
      // this.router.navigateByUrl('/')
    }
  }
  burgerIcon() {
    var x = this.topnav.nativeElement;
    if (x.className === "topnav") {
      x.className += " responsive1";
    } else {
      x.className = "topnav";
    }
  }
  closeMenu(){
    this.burgerIcon();
  }
  routeTo(url:string){
    this.router.navigateByUrl('/'+url);
    this.burgerIcon();
  }

  openmenu(){
    var x = this.sidenav.nativeElement;
    x.style.display = "block";
     x.style.animation= "slideIn 1.2s forwards";
    var y = (document.getElementsByClassName('backdrop') as HTMLCollectionOf<HTMLElement>);
    (y[0]).style.display = "block"; 
  }
  closemenu(){
    var x = this.sidenav.nativeElement;
    x.style.animation= "slideOut 1.2s forwards";
    x.style.transition = "display 1200ms"
    var y = (document.getElementsByClassName('backdrop') as HTMLCollectionOf<HTMLElement>);
    (y[0]).style.display = "none";    
  }
  
  logout() {
    this.showLoader = true;
    this.authservice.logout().subscribe((res:any)=>{
      this.showLoader = false;
        localStorage.clear();
        this.authservice.isLoggedin.next(false);
        this.router.navigateByUrl('/login');  
    });
  }
  logout1(){
    this.logout();
  }

  toQRmodal(){
    this.apiservice.toQR();
  }

  username:any;
  errormsg:any
  forgotPass(){
    this.closeresetModal();
    let x:any = this.data.UserName;
      // if(x == '' || x == null){this.errormsg =('Please enter username'); this.alertservice.success("Error",this.errormsg)}
      // else if(x != '' && x!= this.data.UserName){this.errormsg =('Username is invalid'); this.alertservice.success("Error",this.errormsg)}
      // else{
        this.showLoader=true;
        this.authservice.forgotPassword(x).subscribe((res:any)=>{
          this.showLoader=false;   
          this.newpass=false;  
          this.username = '';     
          if(res.Status == "Success"){ this.alertservice.success("Success","Your password reset link has been sent to your Email.")}
          // if(res.Status == "Failed"){this.errormsg = 'Username is invalid'; this.alertservice.success(this.errormsg)}
          if(res.Status == "Failed"){this.errormsg = res.Message; this.alertservice.success("Failed",this.errormsg)}
        })
      // }
  }
  submitprofile(){
    this.alertservice.success("Information","Profile edit is coming soon");
    this.editpro =false;
  }
  
  visible1=false
  openModal(){
    var x = <HTMLElement>document.getElementById('editmodal1')
    // x.style.display = "block";
    this.alertservice.success('Edit Profile', 'Coming Soon!')

  }
  closeModal(){
    var x = <HTMLElement>document.getElementById('editmodal1')
    x.style.display = "none";
  }
  inputclicked1(e:any){
    this.visible1=!this.visible1
  }
  subcatclicked(t:any){
  }

  resetpassconfirm(){
    this.closemenu();
    this.openprofile=false;
    var x = <HTMLElement>document.getElementById('resetpassmodal')
    x.style.display = "block";
  }
  closeresetModal(){
    var x = <HTMLElement>document.getElementById('resetpassmodal')
    x.style.display = "none";
  }

  //users 
  getUser(){
    this.apiservice.getUserForProfile().subscribe((res:any)=>{
      console.log(res)
    })
  }



  onFileChange(event:any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        // this.data.parentForm.patchValue({
        //   tso: reader.result
        // });
        console.log(file);
        this.pic = file;
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
    const inputElement: HTMLInputElement = document.getElementById('my-input') as HTMLInputElement
    inputElement.files = null;
  }
  

  pic:File;
  upadtePic(){
    this.apiservice.updateProfilePic(this.pic).subscribe((res:any)=>{
      console.log(res)
    })
  }
}
