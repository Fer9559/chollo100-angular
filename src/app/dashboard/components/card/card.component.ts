import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListChollos } from '../../interfaces/list-chollo.interface';

@Component({
  selector: 'chollos-chollo-card2',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {

  private router = inject(Router);

  @Input()
  public chollo!:  ListChollos;
  public images: string[] = []; // Arreglo para las imágenes
  public currentImageIndex: number = 0; // Índice de la imagen actual

  ngOnInit(): void {
    if (!this.chollo) throw new Error('Chollo property is required.');

    // Asignar el array directamente
    if (this.chollo.images && Array.isArray(this.chollo.images)) {
      this.images = this.chollo.images; // Asignación directa si es un array
    }
}

  goToChollo() {
    // Abre el enlace en una nueva pestaña si está disponible
    if (this.chollo.enlace) {
      window.open(this.chollo.enlace, '_blank');
    }
  }

  // Cambia a la imagen anterior
  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  // Cambia a la siguiente imagen
  nextImage() {
    if (this.currentImageIndex < this.images.length - 1) {
      this.currentImageIndex++;
    }
  }

}
