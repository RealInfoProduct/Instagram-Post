import { Component, OnInit } from '@angular/core';
import { PostService } from './post.service';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { Post } from './post';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'INSTAGRAM-POST';
  fileToUpload: any;
  imageUrl:any;
  imageCollection:any = [];
  progress : number = 0;
  uploadImageURL = '';
  uploadUrl:any = [];

  constructor(private postService : PostService, private storage : Storage) {}

  ngOnInit(): void {
    
  }

  handleFileInput(file: any) {
    this.fileToUpload = file.files.item(0);
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;

      if(!this.imageCollection?.includes(this.imageUrl)){
        this.imageCollection.push(this.imageUrl);
        this.storageInImageStore();
      }
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  storageInImageStore(): void {
    this.imageCollection.forEach((element:any) => {
      const storageRef = ref(this.storage, `Design-Images_Folder/${this.fileToUpload.name}`);
      const uploadTask = uploadBytesResumable(storageRef, this.fileToUpload);
      uploadTask.on('state_changed', (snapshot) => {
        this.progress = Number(((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0));
        setInterval(this.progressData, 130);
        console.log('Upload is ' + this.progress + '% done');
      }, (error) => {
        console.log('error---', error);
      }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (downloadURL) {
            this.uploadImageURL = downloadURL;
            this.uploadUrl.push(downloadURL);
          }
        });
      }
      )
    });
  }

  progressData(){
    return this.progress
  }

  onSubmit() {
    const payload: Post = {
      id: '',
      fileName: this.uploadUrl
    }

    if(this.uploadUrl) {
      this.postService.addPost(payload).then((res => {
        if (res) {
          debugger
        }
      }))
    }
  }

  removeImage(i : number){
    this.imageCollection.splice(i,1);
  }


}
