import { Component, inject, Input, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ListChollos } from '../../interfaces/list-chollo.interface';
import { dashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../../auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'chollos-chollo-card2',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {

  private authService = inject(AuthService);
  public user = computed(() => this.authService.currentUser());

  chollos: any[] = [];
  userId: string = "";

  private dashboardService = inject(dashboardService);
  private router = inject(Router);

  @Input()
  public chollo!:  ListChollos;
  public images: string[] = [];
  public currentImageIndex: number = 0;

  ngOnInit(): void {
    if (!this.chollo) throw new Error('Chollo property is required.');

    if (this.chollo.images && Array.isArray(this.chollo.images)) {
      this.images = this.chollo.images;
    }

    this.userId = this.authService.getUserId();
    console.log('ID de usuario logueado: ', this.userId);
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

  getListUserChollos(userId: string): void {
    this.dashboardService.getUserChollos(userId).subscribe(
      (data) => {
        // Ordenar los chollos por la fecha más reciente
        this.chollos = data.sort((a: any, b: any) => {
          const dateA = new Date(a.updatedAt || a.createdAt).getTime();
          const dateB = new Date(b.updatedAt || b.createdAt).getTime();
          return dateB - dateA; // Orden descendente (más reciente primero)
        });
      },
      (error) => {
        console.error('Error al obtener los chollos:', error);
      }
    );
  }

  onUpdateChollo(id_chollo: string) {
    this.router.navigate(['/dashboard/update', id_chollo]);
  }

  onDeleteChollo(id_chollo: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás deshacer esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dashboardService.delete(id_chollo).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El chollo ha sido eliminado.', 'success');
            this.getListUserChollos(this.userId);
          },
          error: (error) => {
            Swal.fire('Error', 'No se pudo eliminar el chollo.', 'error');
            console.error('Error al eliminar el chollo:', error);
          }
        });
      }
    });
  }

}
