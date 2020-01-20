import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { AppointmentService } from '../../shared/appointment.service';

import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { MyData} from '../Appointment'

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.page.html',
  styleUrls: ['./edit-appointment.page.scss'],
})
export class EditAppointmentPage implements OnInit {

  updateBookingForm: FormGroup;
  id: any;

    // Upload Task 
    task: AngularFireUploadTask;
    // Progress in percentage
    percentage: Observable<number>;
    // Snapshot of uploading file
    snapshot: Observable<any>;
    // Uploaded File URL
    UploadedFileURL: Observable<string>;
    //Uploaded Image List
    images: Observable<MyData[]>; imgUrl: string;
    //File details  
    fileName:string; fileSize:number;
    //Status check 
    isUploading:boolean; isUploaded:boolean;
    private imageCollection: AngularFirestoreCollection<MyData>;

  constructor(
    private aptService: AppointmentService,
    private actRoute: ActivatedRoute,
    private router: Router,
    public fb: FormBuilder,
    private storage: AngularFireStorage, 
    private database: AngularFirestore
  ) {
      this.id = this.actRoute.snapshot.paramMap.get('id');
      this.aptService.getBooking(this.id).valueChanges().subscribe(res => {
      this.updateBookingForm.setValue(res);
      this.imgUrl = res.img;
      console.log(this.imgUrl);
      this.isUploading = false;
      this.isUploaded = true;
      this.imageCollection = database.collection<MyData>('freakyImages');
      this.images = this.imageCollection.valueChanges();
    });
  }

  ngOnInit() {
    this.updateBookingForm = this.fb.group({
      name: [''],
      email: [''],
      mobile: [''],
      img: ['']
    })
  }

  updateForm() {
    this.aptService.updateBooking(this.id, this.updateBookingForm.value, this.imgUrl)
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch(error => console.log(error));
  }

  estado(){
    this.isUploading = false;
    this.isUploaded = false;
  }

  uploadFile(event: FileList) {
    // The File object
    const file = event.item(0)
 
    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') { 
     console.error('unsupported file type :( ')
     return;
    }
 
    this.isUploading = true;
    this.isUploaded = false; 
    this.fileName = file.name;
 
    // The storage path
    const path = `freakyStorage/${new Date().getTime()}_${file.name}`;
 
    // Totally optional metadata
    const customMetadata = { app: 'Freaky Image Upload Demo' };
 
    //File reference
    const fileRef = this.storage.ref(path);
 
    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });
 
    // Get file progress percentage
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      
      finalize(() => {
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();
        this.UploadedFileURL.subscribe(resp=>{
          this.addImagetoDB({
            name: file.name,
            filepath: resp,
            size: this.fileSize
          });
          this.isUploading = false;
          this.isUploaded = true;
        },error=>{
          console.error(error);
        })
      }),      
      tap(snap => {
          this.fileSize = snap.totalBytes;
      })
    )

    
  }

  addImagetoDB(image: MyData) {
    //Create an ID for document
    const id = this.database.createId();
    
    //Set document id with value in database
    let respuest = this.imageCollection.doc(id).set(image).then(resp => {
      
    }).catch(error => {
      console.log("error " + error);
    });
    this.imgUrl = image.filepath.toString();
    console.log(this.imgUrl);
  }

}
