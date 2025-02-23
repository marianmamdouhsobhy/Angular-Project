import { Component,OnInit } from '@angular/core';
import { PostsService } from '../posts.service';
import { AuthService } from '../auth.service';
import { forkJoin } from 'rxjs';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  posts: any[] = [];  
  users: any[] = [];
  comments: any[] = [];

  // pagination 
  displayedPosts: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  pageSizeOptions:number[]=[5,10,20,50]

  // search 
  // angularsearch
  // filteredLocationList: HousingLocation[] = [];
  searchQuery: string = '';
  filteredPosts: any[] = [];
  // filteredComments: any[] = [];
  // filteredUsers: any[] = [];
constructor(private PostsService:PostsService, private AuthService:AuthService)
{
// angularsearch
  // this.housingLocationList = this.housingService.getAllHousingLocations();
  // this.filteredLocationList = this.housingLocationList;
}
ngOnInit(): void {

this.loadData();
}

loadData() {
  forkJoin({
    posts: this.PostsService.getPosts('posts'),
    users: this.AuthService.getUsers(),
    comments: this.PostsService.getComments()
  }).subscribe({
    next: (result) => {
      console.log('🔍 API Response:', result); // Check the structure

      if (!Array.isArray(result.posts)) {
        console.error('❌ result.posts is NOT an array:', result.posts);
        return; // Stop execution if posts is not an array
      }

      this.users = Array.isArray(result.users) ? result.users : [];
      this.comments = Array.isArray(result.comments) ? result.comments : [];

      console.log('✅ Posts:', result.posts); // Ensure posts is an array

      this.attachUserAndCommentsToPosts(result.posts);
    },
    error: (err) => console.error('❌ Error fetching data:', err)
  });
}

 
  getUsers() {
    return this.AuthService.getUsers();
    
  }
  getPosts() {
    return this.PostsService.getPosts('postType');
  }
 
  getComments() {
    return this.PostsService.getComments(); // Fetches all comments
  }
  
  attachUserAndCommentsToPosts(posts: any[]) {

  this.posts = posts.map(post => {

    if (!post.userId) {
      console.warn(`Post ID ${post.id} is missing userId!`);
    }

    // Ensure users array exists
    const usersArray = Array.isArray(this.users) ? this.users : [];

    // Find user, ensuring IDs match correctly
    const user = usersArray.find(u => +u.id === +post.userId);

    return {
      ...post,
      userName: user ? user.name : 'Unknown User',
      userImg: user && user.imgpath ? user.imgpath : 'assets/images/user-default.png',
      comments: this.comments.filter(c => c.postId === post.id)
    };
  });

  console.log('Processed Posts:', this.posts);
  this.filteredPosts = [...this.posts]; // Initially, filteredPosts is the same as posts
  this.updatePagination();
}

  
 // pagination start 
 updatePagination() {
  const sourceData = this.searchQuery ? this.filteredPosts : this.posts;
  this.totalPages = Math.ceil(this.posts.length / this.itemsPerPage);
  this.updateDisplayedPosts();
}

updateDisplayedPosts() {
  const sourceData = this.searchQuery ? this.filteredPosts : this.posts;
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  this.displayedPosts = this.filteredPosts.slice(start, end);;
  // this.displayedPosts = this.filteredPosts.length ? this.filteredPosts.slice(start, end) : this.posts.slice(start, end);
}
// Search logic
onSearch(query: string) {
  this.searchQuery = query.toLowerCase();

  this.filteredPosts = this.posts.filter(post =>
    post.title.toLowerCase().includes(this.searchQuery) ||
    post.body.toLowerCase().includes(this.searchQuery) ||
    post.userName.toLowerCase().includes(this.searchQuery)
  );
  this.currentPage = 1; // Reset to first page when searching
  this.updatePagination();
}

// search end

onPageChange(newPage: number) {
  this.currentPage = newPage;
  this.updateDisplayedPosts();
}

onItemsPerPageChange(event: Event) {
  this.itemsPerPage = +(event.target as HTMLSelectElement).value;
  this.currentPage = 1;
  this.updatePagination();
}

  
}

