import { Component } from '@angular/core';
import { Issue } from '../issue';
import { ISSUES } from '../mock-issues';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'zd-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css']
})
export class IssueComponent {
  issues: Issue[] = ISSUES;
  issue?: Issue;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.issue = this.getIssue();
  }

  getIssue(): Issue | undefined {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const issue = this.issues.find((issue): boolean => issue.id === id);
    return issue;
  }

  goBack(): void {
    this.location.back();
  }
}
