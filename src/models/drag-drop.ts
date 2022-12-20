// drag & drop effect interfaces

export interface Draggable {
  dragStart(event: DragEvent): void;
  dragEnd(event: DragEvent): void;
}

export interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}
