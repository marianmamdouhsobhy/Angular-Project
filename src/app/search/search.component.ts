import { Component, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchQuery: string = '';

  @Output() searchChange = new EventEmitter<string>();

  onSearch(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.searchQuery = input;
    this.searchChange.emit(this.searchQuery);
  }
}
