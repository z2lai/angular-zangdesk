import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Issue } from './issue';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private issuesUrl = 'api/issues';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(
    private http: HttpClient
  ) { }

  getIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(this.issuesUrl).pipe(
      tap(_ => console.log('fetched issues')),
      catchError(this.handleError<Issue[]>('getIssues', []))
    ); 
  }

  getIssue(id: number): Observable<Issue> {
    const url = `${this.issuesUrl}/${id}`
    return this.http.get<Issue>(url).pipe(
      tap(_ => console.log(`Fetched Issue id=${id}`)),
      catchError(this.handleError<Issue>('getIssue'))
    );
  }

  updateIssue(updatedIssue: Issue): Observable<any> {
    return this.http.put<Issue>(this.issuesUrl, updatedIssue, this.httpOptions).pipe(
      tap(issue => console.log(`updated Issue id=${updatedIssue.id}`, issue)),
      catchError(this.handleError<Issue>('updateIssue'))
    );
  }

  addIssue(newIssue: Issue): Observable<Issue> {
    return this.http.post<Issue>(this.issuesUrl, newIssue, this.httpOptions).pipe(
      tap((newIssue: Issue) => console.log(`Added Issue w/ id=${newIssue.id}`)),
      catchError(this.handleError<any>(`addIssue`))
    );
  }

  deleteIssue(id: number): Observable<Issue> {
    // Simulating 50 percent chance of throwing an error instead of calling the API
    if (Math.random() >= 0.5) {
      return new Observable(function subscribe(subscriber) {
        setTimeout(() => {
          subscriber.error(new Error(`Simulated delete issue error for id: ${id}`));
        }, 1000);
      });
    } else {
      const url = `${this.issuesUrl}/${id}`
      return this.http.delete<Issue>(url).pipe(
        tap(_ => console.log(`deleted Issue id=${id}`)),
        catchError(this.handleError<Issue>('deleteIssue'))
      );
    }
  }

  searchIssuesByName(name: string): Observable<Issue[]> {
      return this.http.get<Issue[]>(`${this.issuesUrl}/?name=${name}`).pipe(
        tap(x => console.log(x))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
    private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
  
        return of(result as T);
      };
    }
}
