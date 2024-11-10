import { Component, inject } from '@angular/core';

import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { dashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-create-chollo',
  templateUrl: './create-chollo.component.html',
  styleUrls: ['./create-chollo.component.css'] // Crea el archivo CSS si necesitas estilos personalizados
})
export class CreateCholloComponent {

  private fb = inject(FormBuilder);
  private dashboardService = inject(dashboardService);
  private router = inject(Router);

  public myForm: FormGroup = this.fb.group({
    titulo: ['', [ Validators.required ]],
    precio: ['', [ Validators.required ]],
    enlace: ['', [ Validators.required, Validators.minLength(6) ]],
    descripcion: ['', [ Validators.required, Validators.minLength(6) ]],
    images: ['', [ Validators.required, Validators.minLength(6) ]],
  });

  create() {
    if (this.myForm.invalid) {
      Swal.fire('Error', 'Por favor, completa todos los campos requeridos correctamente.', 'error');
      return;
    }

    // Convertir la cadena de imágenes en un array si las imágenes están separadas por comas
    const { titulo, precio, enlace, descripcion, images } = this.myForm.value;

    //Añadir imágenes a array forma simplificada
    const imagesArray = images.split(',').map((image: string) => image.trim());

    this.dashboardService.create(titulo, precio, enlace, descripcion, imagesArray)
      .subscribe({
        next: () => {
          Swal.fire('Éxito', 'Chollo creado exitosamente!', 'success'); // Asegúrate de que este mensaje sea un string
          this.router.navigateByUrl('/dashboard');
        },
        error: (message) => {
          Swal.fire('Error', typeof message === 'string' ? message : 'Ha ocurrido un error al crear el chollo.', 'error');
        }
      });
  }
}
