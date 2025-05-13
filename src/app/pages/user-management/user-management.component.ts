import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
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
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [TableModule, DialogModule, CommonModule,
    ButtonModule, InputTextModule,
    FloatLabelModule, AutoCompleteModule,
    ReactiveFormsModule, DropdownModule, ButtonModule, InputIconModule, FormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements AfterViewInit, OnDestroy {
  first = 0;
  rows = 10;
  showRoleFilter = false;
  visible: boolean = false;
  visible1: boolean = false;
  totalRecords: number = 0;
  loading: boolean = true;
  totalUsers: number = 0;
  enableLazyLoad: boolean = false;
  noRecordsFound: boolean = false;
  @ViewChild('searchInput') searchInput!: ElementRef;
  private searchSubscription!: Subscription;



  roleOptions = [
    { label: 'Admin', value: 'Admin' },
    { label: 'User', value: 'User' },
    { label: 'Manager', value: 'Manager' },
    { label: 'Host', value: 'Host' },
  ];
  viewData?: Iuser;
  apiData: Iuser[] = [];
  addUserForm: FormGroup;
  updateUserForm: FormGroup;
  userData?: Iuser;
  view: boolean = false;
  userId: string = '';
  @ViewChild('table') table!: Table;
  searchValue: string | undefined;

  constructor(private curd: CurdService, private fb: FormBuilder, private messageService: MessageService) {
    this.addUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      role: ['', [Validators.required]]
    });
    this.updateUserForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      role: ['', [Validators.required]]
    })
  }

  saveData() {
    this.curd.postData(this.addUserForm.value).subscribe(res => {
      console.log(this.addUserForm.value);
      this.visible = false;
      this.addUserForm.reset();
      this.getAllData();
    })
    //debugger
    this.messageService.add({ severity: 'success', summary: 'Inserted', detail: 'User Inserted Successfully' });
  }

  UpdateUserData(id: string) {
    debugger
    console.log(id);
    this.userId = id;
    this.curd.getDataById(id).subscribe(res => {
      this.userData = res;
      this.visible1 = true
      this.updateUserForm.setValue({ id: this.userData?.id, name: this.userData?.name, email: this.userData?.email, role: this.userData?.role })
    })
  }
  updateData() {
    debugger
    this.curd.putDataByID(this.userId, this.updateUserForm.value).subscribe(res => {
      this.visible1 = false
      this.updateUserForm.reset();
      this.getAllData();
    })
    this.messageService.add({ severity: 'info', summary: 'Updated', detail: 'User Updated Successfully' });
  }
  deleteUser(id: string) {
    this.userId = id;
    this.curd.deleteData(this.userId).subscribe(res => {
      console.log(res);
      this.getAllData();
    })
    this.messageService.add({ severity: 'warn', summary: 'Deleted', detail: 'User Deleted Successfully' });
  }
  getAllData() {
    this.curd.getData1().subscribe(res => {
      this.apiData = res;
    })
  }
  addUser() {
    this.addUserForm.reset();
    this.visible = true;
  }
  viewUser(id: string) {
    //debugger
    this.userId = id;
    this.view = true;
    this.curd.getDataById(this.userId).subscribe(res => {
      this.viewData = res;
    })
  }
  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isLastPage(): boolean {
    return this.apiData ? this.first + this.rows >= this.apiData.length : true;
  }

  isFirstPage(): boolean {
    return this.apiData ? this.first === 0 : true;
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = ''
  }
  ngOnInit() {
    debugger
    
    this.curd.getTotalUsers().subscribe(res => {
      debugger
      this.apiData = res.body || [];
      const totalCount = res.totalCount;
      this.totalRecords = totalCount ? +totalCount : this.apiData.length;
      this.loading = false;

      this.enableLazyLoad = this.totalRecords > 50;

      if (!this.enableLazyLoad) {
        this.apiData = res.body || [];
      }
    })
  }

  loadDataLazy(event: any) {
    debugger
    const globalFilter = event.globalFilter || '';
    const filters = event.filters || {};
    const roleFilter = filters?.role?.value || '';

    const headers = new HttpHeaders({
      'X-Total-Count': 'true'
    });

    this.loading = true;
    const page = event.first / event.rows;
    const pageSize = event.rows;
    if (this.enableLazyLoad) {
    //  debugger
      this.curd.getData(page, pageSize, globalFilter, roleFilter, headers).subscribe({
        next: (response) => {
          this.apiData = response.body || [];
          const totalCount = response.totalCount;
          this.totalRecords = totalCount ? +totalCount : this.apiData.length;

          debugger
          if (this.apiData.length === 0) {
            this.noRecordsFound = true; // Set the flag if no data
          } else {
            this.noRecordsFound = false; // Reset if data is found
          }

          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading data:', err);
          this.loading = false;
        }
      });

    } else {

      this.curd.getData(page, pageSize, globalFilter, roleFilter, headers).subscribe({
        next: (response) => {
          this.apiData = response.body || [];
          this.totalRecords = this.apiData.length;

          this.noRecordsFound = this.apiData.length === 0;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading data:', err);
          this.loading = false;
        }
      });
    }
  }

  ngAfterViewInit() {
    //debugger
    this.searchSubscription = fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((value: string) => {
        this.filterTable(value);
      });
  }

  filterTable(value: string) {
    console.log('Filtered value (debounced):', value);
    this.table.filterGlobal(value, 'contains');
  }


  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }


}
