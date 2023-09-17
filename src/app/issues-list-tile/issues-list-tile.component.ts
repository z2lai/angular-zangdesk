import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Issue } from '../issue';

@Component({
  selector: 'zd-issues-list-tile',
  templateUrl: './issues-list-tile.component.html',
  styleUrls: ['./issues-list-tile.component.css']
})
export class IssuesListTileComponent {
  @Input() issue!: Issue;
  @Input() active: boolean = false;

  @Output() select = new EventEmitter<number>;

  selectIssue(id: number) {
    this.select.emit(id);
  }
}
