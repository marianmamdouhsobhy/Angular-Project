import { Component,OnInit } from '@angular/core';
import { AlbumsService } from '../albums.service';
import { AuthService } from '../auth.service';
import { SliceArrayPipe } from '../pipes/slice-array.pipe';


@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  providers: [SliceArrayPipe]
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

// Adding new album
newAlbum: any = { title: '' };
showAddAlbumForm = false;


  constructor(private _AlbumService:AlbumsService,private _AuthService: AuthService,private sliceArrayPipe: SliceArrayPipe) {}

  ngOnInit(): void {
    this.fetchAlbums();
  }

 
  fetchAlbums() {
    const storedAlbums = JSON.parse(localStorage.getItem('albums') || '[]');
    this._AlbumService.getAlbums('albums').subscribe((albums: any) => {
      console.log('Raw Albums from API:', albums); // ✅ Check API response
      this.albums = [...storedAlbums, ...albums]; 
      this.filterAlbums();
      this.updatePagination();
       // Apply filter after fetching albums

      console.log('Fetched Albums:', this.albums); // ✅ Confirm albums are stored
  
      this.fetchPhotos(); // ✅ Now fetch photos
    });
  }

  fetchPhotos() {
    this._AlbumService.getPhotos('photos').subscribe((photos: any) => {
      this.albums.forEach(album => {
        // this.photos[album.id] = photos.filter((photo: { albumId: any }) => photo.albumId === album.id).slice(0, 5);

        this.photos[album.id] = this.sliceArrayPipe.transform(
          photos.filter((photo: { albumId: any }) => photo.albumId === album.id),
          0,
          5
        );
      });
    });
  }
  // add album
  openAddAlbumForm() {
    this.showAddAlbumForm = true;
  }

  addAlbum() {
    if (!this.newAlbum.title.trim()) return;

    const newAlbum = { id: Date.now(), title: this.newAlbum.title };
    const storedAlbums = JSON.parse(localStorage.getItem('albums') || '[]');

    storedAlbums.push(newAlbum);
    localStorage.setItem('albums', JSON.stringify(storedAlbums));

    this.albums.unshift(newAlbum);
    this.filterAlbums();
    this.updatePagination();

    this.newAlbum.title = '';
    this.showAddAlbumForm = false;
  }



  updatePagination() {
    this.totalPages = Math.ceil(this.albums.length / this.itemsPerPage);
    this.updateDisplayedAlbums();
  }
  
  updateDisplayedAlbums() {
    // this.totalPages = Math.ceil(this.albums.length / this.itemsPerPage); 
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    console.log(`Page: ${this.currentPage}, Start: ${start}, End: ${end}`);
    // this.displayedalbums = this.filteredAlbums.slice(start, end);
    this.displayedalbums = this.sliceArrayPipe.transform(this.filteredAlbums, start, end);

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
  // const resultsOnCurrentPage = this.filteredAlbums.slice(start, end);
  const resultsOnCurrentPage =this.sliceArrayPipe.transform(this.filteredAlbums, start, end)
  if (resultsOnCurrentPage.length === 0 && this.filteredAlbums.length > 0) {
    // Reset to the first page with results
    this.currentPage = 1;
  }
}



}
