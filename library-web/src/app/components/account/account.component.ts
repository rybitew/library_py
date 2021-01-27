import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../Services/account.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  username = '';
  password = '';
  confirmPassword = '';
  email = '';
  isRegister = false;

  constructor(private service: AccountService, private _snackBar: MatSnackBar, private router: Router) {
  }

  ngOnInit(): void {
  }

  register() {
    if (!this.isRegister) {
      this.isRegister = true;
    } else if (this.username === null || this.username.trim() === '' || this.password === null || this.password.trim() === ''
      || this.confirmPassword === null || this.confirmPassword.trim() === '' || this.email === null || this.email.trim() === '') {
      this.toast('Error: invalid input data');
    } else if (this.password !== this.confirmPassword) {
      this.toast('Error: password doesn\'t match');
    } else {
      this.service.register({email: this.email, password: this.password, username: this.username}).subscribe(res => {
        localStorage.setItem('jwt', res);
        this.router.navigateByUrl('/');
      }, error => {
        console.log(error);
        this.toast(error.error);
      });
    }
  }

  login() {
    if (this.isRegister) {
      this.isRegister = false;
    } else if (this.username === null || this.username.trim() === '' || this.password === null || this.password.trim() === '') {
      this.toast('Error: invalid input data');
    } else {
      this.service.login({password: this.password.trim(), username: this.username.trim()}).subscribe(res => {
        localStorage.setItem('jwt', res);
        this.router.navigateByUrl('/');
      }, error => {
        console.log(error);
        this.toast(error.error);
      });
    }
  }

  toast(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 2000,
    });
  }
}
