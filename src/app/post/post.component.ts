import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
@Input() post:any;
AllComments = false;
@Input() searchQuery: string = '';

showAllComments() {
    this.AllComments = !this.AllComments;
  }
  highlightText(text: string): string {
    if (!this.searchQuery.trim()) return text; // If no search query, return normal text

    const regex = new RegExp(`(${this.searchQuery})`, 'gi'); // Case-insensitive match
    return text.replace(regex, `<span class="highlight">$1</span>`); // Wrap matches in <span>
  }
}
