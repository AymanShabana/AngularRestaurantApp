import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;

  constructor(private formBuilder: FormBuilder) {
    this.initForm();
   }

  ngOnInit(): void {
  }
  initForm(){
    this.feedbackForm = this.formBuilder.group({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
  }
  onSubmit(){
    this.feedback =  this.feedbackForm.value;
    this.feedbackForm.reset();
    console.log(this.feedback);
  }
}
