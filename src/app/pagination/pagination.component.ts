import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
@Input()currentPage:number=1;
@Input() totalPages:number=1;
@Input() itemsPerPage:number=5;
@Input() pageSizeOptions:number[]=[5,10,20,50];

@Output () pageChange= new EventEmitter<number>();
@Output() itemsPerPageChange=new EventEmitter<number>();

changePage(newPage: number) {
  if (newPage >= 1 && newPage <= this.totalPages) {
    this.pageChange.emit(newPage);
  }
}

onPageSizeChange(event: any) {
  this.itemsPerPageChange.emit(Number(event.target.value));
}




}
