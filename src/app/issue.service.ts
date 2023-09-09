import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    return this.http.get<Issue[]>(this.issuesUrl); 
  }

  getIssue(id: number): Observable<Issue> {
    const url = `${this.issuesUrl}/${id}`
    return this.http.get<Issue>(url);
    //TODO: Add error handling if issue is not found
  }

  updateIssue(updatedIssue: Issue): Observable<any> {
    return this.http.put<Issue>(this.issuesUrl, updatedIssue, this.httpOptions);
  }

  addIssue(newIssue: Issue): Observable<Issue> {
    return this.http.post<Issue>(this.issuesUrl, newIssue, this.httpOptions);
  }

  deleteIssue(id: number): Observable<Issue> {
    const url = `${this.issuesUrl}/${id}`
    return this.http.delete<Issue>(url);
  }
}
