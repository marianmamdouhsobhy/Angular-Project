import { Component,OnInit } from '@angular/core';
import { AlbumsService } from '../albums.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
  albums:any[]=[];
  photos:any = {};
// search
searchQuery: string = ''; // Store search input
filteredAlbums: any[] = [];
  // pagination
  displayedalbums: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  pageSizeOptions:number[]=[5,10,20,50]
  displayedPosts: any[] = [];

// photo modal

selectedPhoto: any = null;
isModalOpen: boolean = false;


  constructor(private _AlbumService:AlbumsService) {}

  ngOnInit(): void {
    this.fetchAlbums();
  }

 
  fetchAlbums() {
    this._AlbumService.getAlbums('albums').subscribe((albums: any) => {
      console.log('Raw Albums from API:', albums); // ✅ Check API response
      this.albums = albums;
      this.filterAlbums();
      this.updatePagination();
       // Apply filter after fetching albums

      console.log('Fetched Albums:', this.albums); // ✅ Confirm albums are stored
  
      this.fetchPhotos(); // ✅ Now fetch photos
    });
  }

  fetchPhotos() {
    this._AlbumService.getPhotos('photos').subscribe((photos: any) => {
      // console.log('Photos from API:', photos); // ✅ Log raw photos
  
      this.albums.forEach(album => {
        // console.log(`Filtering photos for album ID: ${album.id}`);
  
        let matchingPhotos = photos.filter((photo: { albumId: any; }) => {
          // console.log(`Comparing: photo.albumId=${photo.albumId} with album.id=${album.id}`);
          return photo.albumId === album.id;
        });
  
        // console.log(`Matched Photos for album ${album.id}:`, matchingPhotos);
  
        this.photos[album.id] = matchingPhotos.slice(0, 5);
      });
  
      // console.log('Filtered Photos:', this.photos); // ✅ Log after filtering
    });
  }
  
  updatePagination() {
    this.totalPages = Math.ceil(this.albums.length / this.itemsPerPage);
    this.updateDisplayedAlbums();
  }
  
  updateDisplayedAlbums() {
    this.totalPages = Math.ceil(this.albums.length / this.itemsPerPage); 
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    console.log(`Page: ${this.currentPage}, Start: ${start}, End: ${end}`);
    this.displayedalbums = this.filteredAlbums.slice(start, end);
    
  }
  
  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.updateDisplayedAlbums();
  }
  
  onItemsPerPageChange(event: Event) {
    const newSize = +(event.target as HTMLSelectElement).value; // Convert string to number
    this.itemsPerPage = newSize;
    this.currentPage = 1; // Reset to first page
    this.updatePagination();
    this.updateDisplayedAlbums();
  }
  

// photo modal
openModal(photo: any) {
  this.selectedPhoto = photo;
  this.isModalOpen = true;
}
// search
onSearchChange(query: string) {
  console.log('Search Query Received in Gallery:', query);
  this.searchQuery = query;
  this.filterAlbums(); // Apply filtering when search changes
  this.adjustPageAfterSearch(); // Adjust the page if necessary
  this.updatePagination();  // Recalculate pagination after filtering
}

filterAlbums() {
  if (!this.searchQuery.trim()) {
    this.filteredAlbums = this.albums;
    return;
  }

  const query = this.searchQuery.toLowerCase();
  this.filteredAlbums = this.albums.filter(album =>
    album.title.toLowerCase().includes(query)
  );
  console.log('Filtered Albums:', this.filteredAlbums); // Log after filtering
}

highlightText(text: string): string {
  if (!this.searchQuery.trim()) return text;

  const regex = new RegExp(`(${this.searchQuery})`, 'gi');
  return text.replace(regex, `<span class="highlight">$1</span>`);
}

adjustPageAfterSearch() {
  // Check if there are no results on the current page
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;

  // If no results are on the current page, reset to the first page with results
  const resultsOnCurrentPage = this.filteredAlbums.slice(start, end);
  
  if (resultsOnCurrentPage.length === 0 && this.filteredAlbums.length > 0) {
    // Reset to the first page with results
    this.currentPage = 1;
  }
}



}
