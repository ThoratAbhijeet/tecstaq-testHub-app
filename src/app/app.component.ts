import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from './shared/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Tecstaq TestHub App';
  isAdmin = false;  
  isLoading = false;
  isLogin:any
  constructor(private router: Router, private _sharedService: SharedService , ) { }
  ngOnInit(): void {
   
    let isLogin:any =localStorage.getItem('isLogin')
    this.isLogin = JSON.parse(isLogin)
    this._sharedService.isLogin$.subscribe({
      next: (res: any) => {
        if (res) {
          this.isLogin = res;
          if (!isLogin){
          } 
            isLogin =localStorage.getItem('isLogin')
        } else {
          this.isLogin = res
        }
      }
    });
    this._sharedService.isLoading$.subscribe({
      next: (res: any) => {
        if (res) {
          this.isLoading = res;
        } else {
          this.isLoading = res
        }
      }
    });
  }
  ngAfterContentChecked() {
    const currentRoute = this.router.routerState.snapshot.url;
    let storedData = localStorage.getItem('data');
    if (currentRoute?.split('/')[1] === 'admin') {
            this.isAdmin = true;
          }
          else if (currentRoute === '/') {
            this.isAdmin = false;
            localStorage.clear();
          } 
          else {
            this.isAdmin = false;
  
          }
          
        }
        navigateToDashboard(): void {
          const storedData = localStorage.getItem('data');
          let isLogin:any =localStorage.getItem('isLogin')
          this.isLogin = JSON.parse(isLogin)
          if (!isLogin ) {
           
            this.router.navigate(['/auth']);
            return;
          }
        }


}
