import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from 'src/app/shared/data-storage-service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user=> {
      this.isAuthenticated = !!user;
    });
  }

  onSaveData() {
    if (confirm('Are you sure you want to overwrite all data on server?')) {
      this.dataStorageService.storeRecipes();
    }
  }
  onLogout() {
    this.authService.logout()
  }
  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }
}
