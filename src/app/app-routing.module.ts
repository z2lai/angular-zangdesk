import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssuesComponent } from './issues/issues.component';
import { IssueComponent } from './issue/issue.component';

const routes: Routes = [
  { path: 'issues', component: IssuesComponent },
  { path: 'issue/:id', component: IssueComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
