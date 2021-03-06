import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Dish} from '../shared/dish';
import {DISHES} from '../shared/dishes';
import { Params, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { DishService } from "../services/dish.service";
import { switchMap } from 'rxjs/operators';
import {Comment} from '../shared/comment';
import { visibility, flyInOut, expand } from "../animations/app.animation";
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations:  [
    flyInOut(),
    visibility(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  comment: Comment;
  errMess: string;
  dishCopy: Dish;
  visibility = 'shown';
  @ViewChild('cform') commentFormDirective;
  formErrors = {
    'author':  '',
    'comment': '',
  };

  validationMessages = {
    'author': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 2 characters.'
    },
    'comment':{
      'required':'Comment is required.'
    }
  };

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    @Inject('BaseURL') private baseURL ) {
      this.initForm();
     }

  ngOnInit(): void {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => {
      this.visibility = 'hidden';
      return this.dishService.getDish(params['id']);
    }))
    .subscribe(dish => {
       this.dish = dish; 
       this.dishCopy = dish;
       this.setPrevNext(dish.id); 
       this.visibility = 'shown';
      }, errmess => this.errMess = errmess);
  }
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
  goBack(): void{
    this.location.back();
  }
  initForm(){
    this.commentForm = this.formBuilder.group({
      author: ['',[Validators.required, Validators.minLength(2)]],
      rating: 5,
      comment: ['',Validators.required],
      date: new Date().toISOString()
    });
    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }
  onValueChanged(data?: any): void {
    if(!this.commentForm) return;
    const form = this.commentForm;
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
    this.comment =  this.commentForm.value;
    this.dishCopy.comments.push(this.comment);
    this.dishService.putDish(this.dishCopy).subscribe(dish => {
      this.dish = dish;
      this.dishCopy = dish;
    },
    errmess => {
      this.dish = null;
      this.dishCopy = null;
      this.errMess = <any>errmess;
    })
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      author:'',
      rating:5,
      comment:'',
      date: new Date().toISOString()
    });
    console.log(this.comment);
  }

}
