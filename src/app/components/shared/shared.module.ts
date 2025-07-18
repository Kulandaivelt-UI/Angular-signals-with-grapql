import { NgModule } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider'; 
import { MatToolbarModule } from '@angular/material/toolbar';


@NgModule({
    
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatRadioModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        FormsModule,
        MatCardModule,
        MatIconModule,
        MatDividerModule
    ],
    exports: [
         CommonModule,
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatRadioModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        FormsModule,
        MatCardModule,
        MatIconModule,
        MatDividerModule,
        MatToolbarModule
    ]
})
export class SharedModule { }
