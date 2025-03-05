import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';


import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { NotfoundComponent } from './notfound/notfound.component';
import {HttpClientModule} from '@angular/common/http';

import { GalleryComponent } from './gallery/gallery.component';
import { PostComponent } from './post/post.component';
import { CommentComponent } from './comment/comment.component';
import { PaginationComponent } from './pagination/pagination.component';
import { PhotoComponent } from './photo/photo.component';
import { SearchComponent } from './search/search.component';
import { SliceArrayPipe } from './pipes/slice-array.pipe';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    LoginComponent,
    NavbarComponent,
    RegisterComponent,
    NotfoundComponent,
    GalleryComponent,
        PostComponent,
        CommentComponent,
        PaginationComponent,
        PhotoComponent,
        SearchComponent,
        SliceArrayPipe,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
