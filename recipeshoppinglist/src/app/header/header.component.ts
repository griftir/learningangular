import { Component } from '@angular/core';
import { DataStorageService } from 'src/app/shared/data-storage-service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  constructor(private dataStorageService: DataStorageService) {}

  onSaveData() {
    if (confirm('Are you sure you want to overwrite all data on server?')) {
      this.dataStorageService.storeRecipes();
    }
  }
  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }
}
