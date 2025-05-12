import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Iuser } from './iuser';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurdService {
  base_url: string = "http://localhost:3000/Users";

  constructor(private http: HttpClient) { }

  // getData(page: number = 0, pageSize: number = 5,globalFilter: string, roleFilter: string, headers: HttpHeaders): Observable<{ body: any[], totalCount: number }> {
  //   debugger
  //   const start = page * pageSize;
  //   const url = `${this.base_url}?_page=${page}&_limit=${pageSize}`;
  //   return this.http.get<Iuser[]>(url)
  //     .pipe(
  //       switchMap(body => {
  //         return this.http.get<Iuser[]>(`${this.base_url}`).pipe(
  //           map(allData => ({





  //             body,
  //             totalCount: allData.length
  //           }))
  //         );
  //       })
  //     );
  // }







  getData(page: number = 0, pageSize: number = 5, globalFilter: string, roleFilter: string, headers: HttpHeaders): Observable<{ body: any[], totalCount: number }> {
    debugger
    const start = page * pageSize;
    const url = `${this.base_url}?_page=${page}&_limit=${pageSize}`;
    return this.http.get<Iuser[]>(url)
      .pipe(
        switchMap(body => {
          return this.http.get<Iuser[]>(`${this.base_url}`).pipe(
            map(allData => {
              if (globalFilter) {
                const lowerGlobal = globalFilter.toLowerCase();
                allData = allData.filter(user =>
                  user.name.toLowerCase().includes(lowerGlobal) ||
                  user.email.toLowerCase().includes(lowerGlobal) ||
                  user.role.toLowerCase().includes(lowerGlobal)
                );
              }

              // 2. Apply role filter
              if (roleFilter) {
                allData = allData.filter(user =>
                  user.role.toLowerCase() === roleFilter.toLowerCase()
                );
              }

              const start = page * pageSize;
              const end = start + pageSize;
              const paginatedData = allData.slice(start, end);

              return {
                body: paginatedData,
                totalCount: allData.length
              };
            })
          );
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
    //return this.http.get<Iuser>(this.base_url, { observe: 'response' })
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
