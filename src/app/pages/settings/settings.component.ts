import { Component } from '@angular/core';
import { CurdService } from '../../curd.service';
import { Iuser } from '../../iuser';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-settings',
  imports: [TableModule, DialogModule, CommonModule,
    ButtonModule, InputTextModule,
    FloatLabelModule, AutoCompleteModule,
    ReactiveFormsModule, DropdownModule, ButtonModule, InputIconModule, FormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  apiData: Iuser[] = [];
  totalRecords: number = 0;
  loading: boolean = true;
  constructor(private curd: CurdService, private fb: FormBuilder, private messageService: MessageService) { }
  // getAllData() {
  //   this.curd.getData().subscribe(res => {
  //     this.apiData = res;
  //   })
  // }
  ngOnInit() {
    // this.getAllData();
  }

  // loadDataLazy(event: any) {
  //   this.loading = true;
  //   const page = event.first / event.rows;
  //   const pageSize = event.rows;

  //   const headers = new HttpHeaders({
  //     'X-Total-Count': 'true'
  //   });

  //   this.curd.getData(page, pageSize, headers).subscribe({
  //     next: (response: any) => {
  //       this.apiData = response.body || [];
  //       const totalCount = response.totalCount;
  //       this.totalRecords = totalCount ? +totalCount : this.apiData.length;
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       console.error('Error loading data:', err);
  //       this.loading = false;
  //     }
  //   });
  // }

}
