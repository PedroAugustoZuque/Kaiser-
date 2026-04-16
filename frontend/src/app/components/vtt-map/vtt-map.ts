import { Component, EventEmitter, Input, Output, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapState, Token } from '../../models/room';

@Component({
  selector: 'app-vtt-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vtt-map.html',
  styleUrl: './vtt-map.scss'
})
export class VttMap {
  @Input({ required: true }) state!: MapState;
  @Input({ required: true }) isGM: boolean = false;
  
  @Output() tokenMoved = new EventEmitter<Token>();
  @Output() mapUpdated = new EventEmitter<MapState>();

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  isPanning = false;
  panStart = { x: 0, y: 0 };
  mapPos = { x: 0, y: 0 };

  draggedToken: Token | null = null;
  dragOffset = { x: 0, y: 0 };

  get containerStyle() {
    return {
      'transform': `scale(${this.state.zoom}) translate(${this.mapPos.x}px, ${this.mapPos.y}px)`,
      'transform-origin': '0 0',
      'cursor': this.isPanning ? 'grabbing' : 'auto'
    };
  }

  get gridStyle() {
    const size = this.state.gridSize;
    return {
      'background-image': `
        linear-gradient(to right, ${this.state.gridColor} 1px, transparent 1px),
        linear-gradient(to bottom, ${this.state.gridColor} 1px, transparent 1px)
      `,
      'background-size': `${size}px ${size}px`,
      'background-position': `${this.state.offsetX}px ${this.state.offsetY}px`,
      'opacity': this.state.opacity,
      'width': '5000px', // Large enough for now
      'height': '5000px',
      'pointer-events': 'none'
    };
  }

  getTokenStyle(token: Token) {
    const pixelSize = token.size * this.state.gridSize;
    return {
      'left': `${token.x}px`,
      'top': `${token.y}px`,
      'width': `${pixelSize}px`,
      'height': `${pixelSize}px`,
      'z-index': 100
    };
  }

  // --- Interaction Logic ---

  onMouseDown(event: MouseEvent) {
    if (event.button === 1 || (event.button === 0 && event.altKey)) { // Middle click or Alt+Left for pan
      this.startPanning(event);
    }
  }

  startPanning(event: MouseEvent) {
    this.isPanning = true;
    this.panStart = { x: event.clientX - this.mapPos.x, y: event.clientY - this.mapPos.y };
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isPanning) {
      this.mapPos = {
        x: event.clientX - this.panStart.x,
        y: event.clientY - this.panStart.y
      };
    } else if (this.draggedToken) {
      const parentRect = this.mapContainer.nativeElement.getBoundingClientRect();
      const zoom = this.state.zoom;
      
      // Calculate position relative to the scaled container
      this.draggedToken.x = (event.clientX - parentRect.left) / zoom - this.dragOffset.x;
      this.draggedToken.y = (event.clientY - parentRect.top) / zoom - this.dragOffset.y;
    }
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    this.isPanning = false;
    if (this.draggedToken) {
      this.tokenMoved.emit(this.draggedToken);
      this.draggedToken = null;
    }
  }

  onTokenStartDrag(event: MouseEvent, token: Token) {
    if (!this.isGM && token.type !== 'agent') return; // Simple permission for now
    
    event.stopPropagation();
    this.draggedToken = token;
    
    // Relative click position within the token
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const zoom = this.state.zoom;
    this.dragOffset = {
      x: (event.clientX - rect.left) / zoom,
      y: (event.clientY - rect.top) / zoom
    };
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    this.state.zoom = Math.min(Math.max(0.25, this.state.zoom + delta), 3.0);
    this.mapUpdated.emit(this.state);
  }
}
