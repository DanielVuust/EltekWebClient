import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  showSnackbar(content: string, actionText: string, duration: number = 5000, verticalPosition: any = "bottom", horizontalPosition: any = "center") {
    if(content == "" || content == null || content == undefined){
      content = "An error occurred";
    }
    this.snackBar.open(content, actionText, {
      duration: duration,
      verticalPosition: verticalPosition,
      horizontalPosition: horizontalPosition
    });
  }
}
