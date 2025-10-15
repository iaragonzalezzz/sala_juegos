import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appResaltarTop]',
  standalone: true
})
export class ResaltarTopDirective implements OnInit {
  @Input('appResaltarTop') posicion!: number;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.posicion === 1) {
      this.el.nativeElement.style.color = 'gold';
      this.el.nativeElement.style.fontWeight = 'bold';
    } else if (this.posicion === 2) {
      this.el.nativeElement.style.color = 'silver';
    } else if (this.posicion === 3) {
      this.el.nativeElement.style.color = 'peru';
    }
  }
}
