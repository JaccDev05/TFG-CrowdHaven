import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../api/models/user.model';
import { Post } from '../../api/models/post.model';
import { Role } from '../../api/models/role.model';
import { Reward } from '../../api/models/reward.model';
import { RewardPurchase } from '../../api/models/reward-purchase';
import { Community } from '../../api/models/community.model';
import { UserService } from '../../api/services/user/user.service';
import { PostService } from '../../api/services/post/post.service';
import { CommunityService } from '../../api/services/community/community.service';
import { RewardService } from '../../api/services/reward/reward.service';

interface UserStats {
  totalPosts: number;
  totalComments: number;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})

export class PerfilComponent implements OnInit {
  user: User | null = null;
  isLoading = false;
  error: string | null = null;
  isEditMode = false;

  // Form para edición
  editProfileForm: FormGroup;

  // Avatar preview
  previewAvatar: string | null = null;
  selectedFile: File | null = null;

  // Estadísticas del usuario
  userStats: UserStats = {
    totalPosts: 0,
    totalComments: 0 // Lo dejaremos en 0 por ahora
  };

  // Roles y recompensas
  userRoles: Role[] = [];
  userRewards: Reward[] = [];
  userCommunities: Community[] = [];

  // Para obtener el ID del usuario (puede venir de la ruta o del usuario logueado)
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private postService: PostService,
    private communityService: CommunityService,
    private rewardService: RewardService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editProfileForm = this.createForm();
  }

  ngOnInit(): void {
    this.getUserId();
    if (this.userId) {
      this.loadUserData();
    } else {
      this.error = 'No se pudo obtener el ID del usuario';
    }
  }

  private getUserId(): void {
    // Intentar obtener el ID de la ruta primero
    const routeId = this.route.snapshot.paramMap.get('id');
    if (routeId) {
      this.userId = parseInt(routeId, 10);
    } else {
      // Si no hay ID en la ruta, podrías obtenerlo del servicio de autenticación
      // Por ahora, usar un ID por defecto o manejarlo según tu lógica de autenticación
      this.userId = 1; // Cambiar esto según tu lógica de usuario logueado
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]],
      bio: ['', [
        Validators.maxLength(500)
      ]]
    });
  }

  loadUserData(): void {
    if (!this.userId) return;

    this.isLoading = true;
    this.error = null;

    // Cargar datos del usuario
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.populateForm();
        this.loadUserStats();
        this.loadUserRolesAndRewards();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.error = 'No se pudo cargar la información del usuario';
        this.isLoading = false;
      }
    });
  }

  private populateForm(): void {
    if (this.user) {
      this.editProfileForm.patchValue({
        username: this.user.username,
        bio: '' // Campo bio no disponible por ahora
      });
    }
  }

  private loadUserStats(): void {
    if (!this.userId) return;

    // Cargar posts del usuario
    this.postService.getPostsByUser(this.userId).subscribe({
      next: (posts) => {
        this.userStats.totalPosts = posts.length;
        // para contar comentarios totales de todos los posts del usuario (sin implementar):
        // this.userStats.totalComments = posts.reduce((total, post) => total + (post.comments?.length || 0), 0);
      },
      error: (error) => {
        console.error('Error loading user posts:', error);
      }
    });
  }

  private loadUserRolesAndRewards(): void {
    if (!this.userId) return;

    // Cargar comunidades del usuario para obtener sus roles
    this.communityService.getCommunitiesByUser(this.userId).subscribe({
      next: (communities) => {
        this.userCommunities = communities;
        this.extractUserRoles(communities);
      },
      error: (error) => {
        console.error('Error loading user communities:', error);
      }
    });

    // Cargar todas las recompensas (necesitarías filtrar por usuario si tienes ese endpoint)
    this.rewardService.getAllRewards().subscribe({
      next: (rewards) => {
        // Por ahora mostramos todas las recompensas
        // Idealmente necesitarías un endpoint para obtener las recompensas del usuario específico
        this.userRewards = rewards.slice(0, 5); // Limitamos a 5 por ahora
      },
      error: (error) => {
        console.error('Error loading rewards:', error);
      }
    });
  }

  private extractUserRoles(communities: Community[]): void {
    this.userRoles = [];
    communities.forEach(community => {
      if (community.roles && community.roles.length > 0) {
        // Agregar roles de cada comunidad
        community.roles.forEach(role => {
          this.userRoles.push({
            ...role,
            community: {
              id: community.id,
              name: community.name
            }
          });
        });
      }
    });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      // Cancelar edición, resetear form y preview
      this.populateForm();
      this.previewAvatar = null;
      this.selectedFile = null;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewAvatar = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeAvatar(): void {
    this.previewAvatar = null;
    this.selectedFile = null;
    // Limpiar el input file
    const fileInput = document.getElementById('avatar-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  saveProfile(): void {
    if (this.editProfileForm.invalid || !this.user) {
      return;
    }

    this.isLoading = true;
    const formData = this.editProfileForm.value;

    // Preparar datos actualizados del usuario
    const updatedUser: User = {
      ...this.user,
      username: formData.username,
      // Si tuvieras campo bio: bio: formData.bio
    };

    // Si hay un nuevo avatar seleccionado
    if (this.selectedFile) {
      // Aquí necesitarías implementar la subida de archivo
      // Por ahora, simular con la URL del preview
      updatedUser.avatar = this.previewAvatar;
    }

    // Actualizar usuario
    this.userService.updateUser(this.user.id, updatedUser).subscribe({
      next: (user) => {
        this.user = user;
        this.isEditMode = false;
        this.previewAvatar = null;
        this.selectedFile = null;
        this.isLoading = false;
        console.log('Perfil actualizado exitosamente');
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.error = 'No se pudo actualizar el perfil';
        this.isLoading = false;
      }
    });
  }

  refreshUserData(): void {
    this.loadUserData();
  }

  getFormattedDate(dateString: string | undefined): string {
    if (!dateString) return 'No disponible';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha no válida';
    }
  }

  getRewardTypeIcon(rewardType: string): string {
    const icons: { [key: string]: string } = {
      'badge': '🏆',
      'achievement': '🎖️',
      'trophy': '🏅',
      'medal': '🥇',
      'star': '⭐',
      'crown': '👑',
      'default': '🎁'
    };

    return icons[rewardType.toLowerCase()] || icons['default'];
  }

  // Getters para errores de validación
  get usernameErrors(): string {
    const control = this.editProfileForm.get('username');
    if (control?.errors) {
      if (control.errors['required']) return 'El nombre de usuario es requerido';
      if (control.errors['minlength']) return 'Mínimo 3 caracteres';
      if (control.errors['maxlength']) return 'Máximo 20 caracteres';
      if (control.errors['pattern']) return 'Solo letras, números y guiones bajos';
    }
    return '';
  }

  get bioErrors(): string {
    const control = this.editProfileForm.get('bio');
    if (control?.errors) {
      if (control.errors['maxlength']) return 'Máximo 500 caracteres';
    }
    return '';
  }
}