import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MAT_DIALOG_DATA, MatDialogModule, MatDialogContent} from '@angular/material/dialog';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
@Component({
  selector: 'app-confirm-delete-dialog',
  imports: [MatButtonModule, MatDialogModule, MatDialogContent],
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrl: './confirm-delete-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class ConfirmDeleteDialogComponent {
  task = inject(MAT_DIALOG_DATA);
}
