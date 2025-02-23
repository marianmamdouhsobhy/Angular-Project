import { Component, Input }from '@angular/core';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent {
  @Input() photo: any; // Photo details
  @Input() isOpen: boolean = false;

  closeModal() {
    this.isOpen = false;
  }
}
