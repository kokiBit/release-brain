import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController } from 'ionic-angular';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { ReactNativeFile } from 'apollo-upload-client';

const uploadFileGql = gql`
mutation UploadFile($file: ImageType!) {
  uploadFileMutation(avatar: $file) {
    user {
      name
      avatar
    }
  }
}
`;

@IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;

  item: any;

  form: FormGroup;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, formBuilder: FormBuilder, public camera: Camera, private apollo: Apollo) {
    this.form = formBuilder.group({
      profilePic: [''],
      name: ['', Validators.required],
      about: ['']
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewDidLoad() {

  }

  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'profilePic': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);

    console.log(typeof event.target.files[0])
    console.log(event.target.files[0])

    this.apollo.mutate({
      mutation: uploadFileGql,
      variables: {
        file: event.target.files[0]
      }
    }).subscribe(
      result => console.log(result),
      error => console.log(error)
    );
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['profilePic'].value + ')'
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    //if (!this.form.valid) { return; }
    //this.viewCtrl.dismiss(this.form.value);
    this.viewCtrl.dismiss(this.form.value);

    console.log(this.form)
    // const fileSampel = new ReactNativeFile({
    //   uri: this.fileInput.baseURL,
    //   name: 'hoge.jpg',
    //   type: 'image/jpeg'
    // })
    // this.apollo.mutate({
    //   mutation: uploadFileGql,
    //   variables: {
    //     file: fileSampel
    //   }
    // }).subscribe(
    //   result => console.log(result),
    //   error => console.log(error)
    // );
  }
}
