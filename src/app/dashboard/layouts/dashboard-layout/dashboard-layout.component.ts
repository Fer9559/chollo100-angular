import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { dashboardService } from '../../services/dashboard.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ListChollos } from '../../interfaces/list-chollo.interface';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {

  private authService = inject(AuthService);
  public user = computed(() => this.authService.currentUser());

  chollos: any[] = []; // Array para almacenar los chollos
  userId: string = ""; // ID del usuario

  private dashboardService = inject(dashboardService);
  private router = inject(Router);

  ngOnInit(): void {
    this.userId = this.authService.getUserId(); // Obtener ID del usuario autenticado desde el servicio de autenticación
    console.log('ID de usuario logueado: ', this.userId);
    this.getListUserChollos(this.userId); // Cargar chollos del usuario

  }

  // Método para obtener los chollos del usuario
  getListUserChollos(userId: string): void {
    this.dashboardService.getUserChollos(userId).subscribe(
      (data) => {
        // Ordenar los chollos por la fecha más reciente (createdAt o updatedAt)
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

  // Redirigir a la página de actualización con el ID del chollo
  onUpdateChollo(id_chollo: string) {
    this.router.navigate(['/dashboard/update', id_chollo]);
  }

  // Método para eliminar un chollo con confirmación
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
        // Llamada al servicio para eliminar el chollo
        this.dashboardService.delete(id_chollo).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El chollo ha sido eliminado.', 'success');
            this.getListUserChollos(this.userId); // Recargar lista de chollos tras la eliminación
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

