import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Issue } from '../issue';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { IssueService } from '../issue.service';

@Component({
  selector: 'zd-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueComponent {
  issue?: Issue;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private issueService: IssueService
  ) { }

  ngOnInit(): void {
    this.getIssue();
  }

  getIssue(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.issueService.getIssue(id)
      .subscribe(issue => this.issue = issue);
  }

  save(): void {
    if (this.issue) {
      this.issueService.updateIssue(this.issue)
        .subscribe(() => this.goBack());
    }
  }

  goBack(): void {
    this.location.back();
  }
}
