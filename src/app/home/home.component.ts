import { ChangeDetectorRef, Component,OnInit } from '@angular/core';
import { PostsService } from '../posts.service';
import { AuthService } from '../auth.service';
import { forkJoin,Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators,FormBuilder  } from '@angular/forms';
import { SliceArrayPipe } from '../pipes/slice-array.pipe';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [SliceArrayPipe]
})
export class HomeComponent {
  posts: any[] = [];  
  users: any[] = [];
  comments: any[] = [];
  
  // user roles
  userRole: string | null = null; // Allow null values
  private subscription!: Subscription;
  postForm: FormGroup;

  // pagination 
  displayedPosts: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  pageSizeOptions:number[]=[5,10,20,50]

  // search 
  // angularsearch

  searchQuery: string = '';
  filteredPosts: any[] = [];

constructor(private PostsService:PostsService, private AuthService:AuthService, private fb:FormBuilder,private cdr: ChangeDetectorRef, private sliceArrayPipe: SliceArrayPipe)
{
  this.postForm = new FormGroup({
    title: new FormControl('', Validators.required),  // Ensure validation
    body: new FormControl('', Validators.required)
  });
}
ngOnInit(): void {
  this.subscription = this.AuthService.userRole$.subscribe(role => {
    this.userRole = role;
  });
this.loadData();
// this.submitPost();
}
//submit post as an admin
submitPost() {
  if (this.postForm.invalid) {
    console.error("Title and body are required!");
    return;
  }

  const user = this.AuthService.currentUser.getValue(); // Get logged-in user
  console.log("Logged-in User Data:", user);
  if (!user) {
    console.error("No logged-in user found!");
    return;
  }

  const newPost = {
    ...this.postForm.value,
    id: this.posts.length + 1, // Temporary unique ID
    userId: user.id,
    userName: user.name,
    userImg:user?.imgpath ? user.imgpath : 'assets/images/user-default.png', // Attach image
    comments: [] // New posts start with no comments
  };
  console.log("New Post Data:", newPost);
  this.posts.unshift(newPost); // Add new post at the beginning
  this.filteredPosts = [...this.posts]; // Update displayed posts
  this.attachUserAndCommentsToPosts(this.posts);
  this.postForm.reset(); // Reset form after submission

  this.cdr.markForCheck();
  this.cdr.detectChanges(); // Ensure UI refresh
this.updateDisplayedPosts();
  console.log("New Post Added:", newPost);
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

     // Find user by userId
     const user = this.users.find(u => +u.id === +post.userId);

     // Debugging: Log matched user
    //  console.log(`Matched user for post ${post.id}:`, user);

    return {
      ...post,
      userName: user ? user.name : 'Unknown User',
     
      userImg: user?.imgpath ? user.imgpath : 'assets/images/user-default.png',
      comments: this.comments.filter(c => c.postId === post.id)
    };
    this.cdr.detectChanges(); // Force UI update

  });

  // console.log('Processed Posts:', this.posts);
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
  // this.displayedPosts = this.filteredPosts.slice(start, end);
  this.displayedPosts = this.sliceArrayPipe.transform(sourceData, start, end);
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

  // roles destroy
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
 
  
}

