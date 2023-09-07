import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Issue } from './issue';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private issuesUrl = 'api/issues';

  constructor(
    private http: HttpClient
  ) { }

  getIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(this.issuesUrl); 
  }

  getIssue(id: number): Observable<Issue> {
    const url = `${this.issuesUrl}/${id}`
    return this.http.get<Issue>(url);
  }
}
