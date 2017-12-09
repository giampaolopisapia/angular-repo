import { Component, OnInit, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: number[];
  prev: number;
  next: number;
  commentForm: FormGroup;
  comment: Comment;
  errMess : string;

  formErrors = {
    'comment': '',
  };

  validationMessages = {
    'author': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
  };

   constructor(private dishservice: DishService,
     private route: ActivatedRoute,
     private location: Location,
     private fb: FormBuilder,
     @Inject('BaseURL') private BaseURL
      ) {
       this.createForm();
     }

   ngOnInit() {
     this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
      this.route.params
        .switchMap((params: Params) => this.dishservice.getDish(+params['id']))
        .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); },
      errmess => this.errMess = <any>errmess);
   }

   setPrevNext(dishId: number) {
      let index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
    }

   goBack(): void {
     this.location.back();
   }

   createForm() {

     this.commentForm = this.fb.group({
       author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
       rating: '5',
       comment: ''
     });
     this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));

     this.onValueChanged(); // (re)set validation messages now
   }

   onValueChanged(data?: any) {
       if (!this.commentForm) { return; }
       const form = this.commentForm;
       for (const field in this.formErrors) {
         // clear previous error message (if any)
         this.formErrors[field] = '';
         const control = form.get(field);
         if (control && control.dirty && !control.valid) {
           const messages = this.validationMessages[field];
           for (const key in control.errors) {
             this.formErrors[field] += messages[key] + ' ';
           }
         }
       }
     }

   onSubmit() {

     //this.comment = this.commentForm.value;
     //console.log(this.comment);
     //push comment in dish comments array


     this.commentForm.reset({
       author: '',
       rating: '5',
       comment: ''
     });
   }
}
