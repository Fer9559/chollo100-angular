import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { dashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-update-chollo',
  templateUrl: './update-chollo.component.html',
  styleUrls: ['./update-chollo.component.css']
})
export class UpdateCholloComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dashboardService = inject(dashboardService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public myForm: FormGroup;

  // Variables para almacenar los datos del chollo
  public titulo: string = '';
  public precio: string = '';
  public enlace: string = '';
  public descripcion: string = '';
  public images: string = '';

  cholloId!: string;

  constructor() {
    // Inicialización del formulario
    this.myForm = this.fb.group({
      titulo: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      enlace: ['', [Validators.required, Validators.minLength(6)]],
      descripcion: ['', [Validators.required, Validators.minLength(6)]],
      images: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.cholloId = this.route.snapshot.paramMap.get('id_chollo')!;

    this.dashboardService.getCholloById(this.cholloId).subscribe((response: any) => {
      // Verificar que la respuesta sea un array y que tenga al menos un elemento
      if (Array.isArray(response) && response.length > 0) {
        const chollo = response[0]; // Obtener el primer elemento del array

        // Asegurarse de que chollo e imágenes existan
        if (chollo && chollo.images !== undefined) {
          this.myForm.setValue({
            titulo: chollo.titulo,
            precio: chollo.precio,
            enlace: chollo.enlace,
            descripcion: chollo.descripcion,
            images: chollo.images.join(', ') // Unir las imágenes como una cadena separada por comas
          });
        } else {
          console.error('El chollo no tiene la propiedad images o está undefined', chollo);
          Swal.fire('Error', 'No se pudo cargar la información del chollo.', 'error');
        }
      } else {
        console.error('No se encontró el chollo en la respuesta', response);
        Swal.fire('Error', 'No se encontró el chollo.', 'error');
      }
    }, error => {
      console.error('Error al obtener el chollo:', error);
      Swal.fire('Error', 'Ha ocurrido un error al cargar el chollo.', 'error');
    });
}

  update() {
    if (this.myForm.invalid) {
      Swal.fire('Error', 'Por favor, completa todos los campos requeridos correctamente.', 'error');
      return;
    }

    const { titulo, precio, enlace, descripcion, images } = this.myForm.value;
    const imagesArray = images.split(',').map((image: string) => image.trim());

    this.dashboardService.update(this.cholloId, titulo, precio, enlace, descripcion, imagesArray).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Chollo actualizado exitosamente!', 'success');
        this.router.navigateByUrl('/dashboard');
      },
      error: (message) => {
        Swal.fire('Error', typeof message === 'string' ? message : 'Ha ocurrido un error al actualizar el chollo.', 'error');
      }
    });
  }
}

