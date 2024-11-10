import { Component, Input, OnInit, inject } from '@angular/core';
import { ListAllChollos } from '../../interfaces/list-all-chollos.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'chollos-chollo-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {

  private router = inject(Router);

  @Input()
  public chollo!:  ListAllChollos;
  public images: string[] = [];
  public currentImageIndex: number = 0;

  ngOnInit(): void {
    if (!this.chollo) throw new Error('Chollo property is required.');

    if (this.chollo.images && Array.isArray(this.chollo.images)) {
      this.images = this.chollo.images; // Asignación directa si es un array
    }
}

  goToChollo() {
    if (this.chollo.enlace) {
      window.open(this.chollo.enlace, '_blank');
    }
  }

  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.images.length - 1) {
      this.currentImageIndex++;
    }
  }
}
