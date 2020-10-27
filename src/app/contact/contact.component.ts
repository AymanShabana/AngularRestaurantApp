import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut } from '../animations/app.animation';
import { FeedbackService } from "../services/feedback.service";
import { expand } from "../animations/app.animation";
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations:  [
    flyInOut(),
    expand()
  ]

})
export class ContactComponent implements OnInit {
  feedbackForm: FormGroup;
  feedback: Feedback;
  errMess: string;
  contactType = ContactType;
  loadingSpinner = 'a';
  inputForm = null;
  serverResult = 'a';
  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    'firstname':  '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required': 'Firstname is required.',
      'minlength': 'Firstname must be at least 2 characters.',
      'maxlength': 'Firstname cannot be more than 25 characters.'
    },
    'lastname': {
      'required': 'Lastname is required.',
      'minlength': 'Lastname must be at least 2 characters.',
      'maxlength': 'Lastname cannot be more than 25 characters.'
    },
    'telnum':{
      'required':'Tel. number is required.',
      'pattern': 'Tel. number must contain only numbers.'
    },
    'email':{
      'required':'Email is required.',
      'email': 'Use a valid email.'
    }
  };

  constructor(private formBuilder: FormBuilder,
    private feebackService: FeedbackService) {
    this.initForm();
   }

  ngOnInit(): void {
  }
  initForm(){
    this.feedbackForm = this.formBuilder.group({
      firstname: ['',[Validators.required, Validators.minLength(2),Validators.maxLength(25)]],
      lastname: ['',[Validators.required, Validators.minLength(2),Validators.maxLength(25)]],
      telnum: [0,[Validators.required,Validators.pattern]],
      email: ['',[Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();;
  }
  onValueChanged(data?: any): void {
    if(!this.feedbackForm) return;
    const form = this.feedbackForm;
    for(const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        this.formErrors[field] = '';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field] +=messages[key]+' ';
            }
          }
        }
      }
    }
  }
  onSubmit(){
    this.loadingSpinner=null;
    this.inputForm='a';
    this.feedback =  this.feedbackForm.value;
    this.feedbackForm.reset({
      firstname:'',
      lastname:'',
      telnum:0,
      email:'',
      agree:false,
      contacttype:'None',
      message:''
    });
    this.feebackService.submitFeedback(this.feedback).subscribe(fb => {
      this.feedback = fb;
      console.log(fb);
      this.loadingSpinner='a';
      this.serverResult = null;
      setTimeout(()=>{this.serverResult='a';this.inputForm=null;},5000);
    },
    errmess => {
      this.feedback = null;
      this.errMess = <any>errmess;
      this.loadingSpinner='a';
      this.inputForm=null;
    });
    this.feedbackFormDirective.resetForm();
  }
}
