import { Injectable } from '@angular/core';
import { Post } from './post';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private fireStore : Firestore) { }

  addPost(post:Post) {
    post.id = doc(collection(this.fireStore, 'id')).id;
    return addDoc(collection(this.fireStore, 'PostDetails'), post)
  }

  getPost():Observable<Post[]> {
    let fileRef = collection(this.fireStore , 'PostDetails');
    return collectionData(fileRef , {idField : 'id'}) as Observable<Post[]>
  }

  deletePost(post:Post) {
    let deletePostRef = doc(collection(this.fireStore, `PostDetails/${post.id}`));
    return deleteDoc(deletePostRef)
  }

  updatePost(post:Post, postDetail :any) {
    let updatePostRef = doc(collection(this.fireStore, `PostDetails/${post.id}`));
    return updateDoc(updatePostRef, postDetail)
  }
}
