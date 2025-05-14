import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Iuser } from './iuser';
import { map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurdService {
  //base_url: string = "http://localhost:3000/Users";

  base_url: string = "https://682469f865ba0580339a3047.mockapi.io/users/user";

  constructor(private http: HttpClient) { }


  getData(page: number = 0, pageSize: number = 5, globalFilter: string, roleFilter: string, headers: HttpHeaders): Observable<{ body: any[], totalCount: number }> {
    const start = page * pageSize;
    //const url = `${this.base_url}?_page=${page}&_limit=${pageSize}`;
    const url = `${this.base_url}`;
    //debugger
    return this.http.get<Iuser[]>(url, { headers }).pipe(
      switchMap(users => {
        let filteredData = [...users];


        if (globalFilter) {
          //debugger
          const lowerGlobal = globalFilter.toLowerCase();
          filteredData = filteredData.filter(user =>
            user.name?.toLowerCase().includes(lowerGlobal) ||
            user.email?.toLowerCase().includes(lowerGlobal) ||
            user.role?.toLowerCase().includes(lowerGlobal)
          );
        }


        if (roleFilter) {
          filteredData = filteredData.filter(user =>
            user.role?.toLowerCase() === roleFilter.toLowerCase()
          );
        }


        const paginatedData = filteredData.slice(start, start + pageSize);

        return of({
          body: paginatedData,
          totalCount: filteredData.length
        });
      })
    );
  }


  getData1() {
    return this.http.get<Iuser[]>(this.base_url)
  }

  postData(data: Iuser) {
    return this.http.post(this.base_url, data)
  }

  getDataById(id: string) {
    debugger
    return this.http.get<Iuser>(`${this.base_url}/${id}`);
  }
  putDataByID(id: string, data: Iuser) {
    return this.http.put(`${this.base_url}/${id}`, data)
  }
  deleteData(id: string) {
    return this.http.delete(`${this.base_url}/${id}`);
  }

  getTotalUsers(): Observable<{ body: any[], totalCount: number }> {
    //debugger

    return this.http.get<Iuser[]>(this.base_url)
      .pipe(
        switchMap(body => {
          return this.http.get<Iuser[]>(`${this.base_url}`).pipe(
            map(allData => ({
              body,
              totalCount: allData.length
            }))
          );
        })
      );
  }
}
