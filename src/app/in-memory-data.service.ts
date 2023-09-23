import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Issue } from './issue';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const issues = [
      { id: 12, name: 'Main Layout' },
      { id: 13, name: 'Navigation' },
      { id: 14, name: 'Persistence' },
      { id: 15, name: 'Data Service' },
    ];
    return { issues };
  }

  genId(issues: Issue[]): number {
    return issues.length > 0 ? Math.max(...issues.map(issue => issue.id!)) + 1 : 11;
  }
}
