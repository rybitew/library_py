import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  loggedIn = false;

  constructor(private _snackBar: MatSnackBar, private router: Router) {
  }

  ngOnInit(): void {
  }

  redirect() {
    if (localStorage.getItem('jwt')) {
      this.toast('Logged out');
      localStorage.clear();
      this.router.navigateByUrl('/account').then(() => this.router.navigateByUrl('/'));
      // this.router.navigateByUrl('/');
    } else {
      this.router.navigateByUrl('/account');
    }
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  toast(message: string) {
    this._snackBar.open(message, null, {
      duration: 2000,
    });
  }
}
