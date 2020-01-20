import { Injectable } from '@angular/core';
import { Appointment } from '../Appointment/Appointment';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';

export interface MyData {
  name: string;
  filepath: string;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  bookingListRef: AngularFireList<any>;
  bookingRef: AngularFireObject<any>;

  bookingForm: FormGroup;

  // Upload Task 
  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;
  
  // Snapshot of uploading file
  snapshot: Observable<any>;
  
  // Uploaded File URL
  UploadedFileURL: Observable<string>;
  
  //Uploaded Image List
  images: Observable<MyData[]>;

  //File details  
  fileName:string;
  fileSize:number;
 
  //Status check 
  isUploading:boolean;
  isUploaded:boolean;

  private imageCollection: AngularFirestoreCollection<MyData>;

  constructor(private db: AngularFireDatabase,
    private storage: AngularFireStorage, 
    private database: AngularFirestore) 
    {
      this.isUploading = false;
      this.isUploaded = false;
      this.imageCollection = database.collection<MyData>('freakyImages');
      this.images = this.imageCollection.valueChanges();
     }

  // Get List
  getBookingList() {
    return this.bookingListRef = this.db.list('appointment');
  }

  // Create
  createBooking(apt: Appointment, url: string) {
    return this.bookingListRef.push({
      name: apt.name,
      img: url,
      email: apt.email,
      mobile: apt.mobile,
    });
  }

  // Update
  updateBooking(id, apt: Appointment, imgUrl: string) {
    return this.bookingRef.update({
      name: apt.name,
      email: apt.email,
      mobile: apt.mobile,
      img: imgUrl
    })
  }

  // Get Single
  getBooking(id: string) {
    this.bookingRef = this.db.object('/appointment/' + id);
    return this.bookingRef;
  }

  // Delete
  deleteBooking(id: string) {
    this.bookingRef = this.db.object('/appointment/' + id);
    this.bookingRef.remove();
  }



}
