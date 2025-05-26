import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../api/models/user.model';
import { Post } from '../../api/models/post.model';
import { Role } from '../../api/models/role.model';
import { Reward } from '../../api/models/reward.model';
import { Community } from '../../api/models/community.model';
import { UserService } from '../../api/services/user/user.service';
import { PostService } from '../../api/services/post/post.service';
import { CommunityService } from '../../api/services/community/community.service';
import { RewardService } from '../../api/services/reward/reward.service';
import { UserStateService } from '../../PagInicio/loginservices/user-state.service';
import { UserDTO } from '../../api/dtos/user-dto';
import { RewardPurchaseService } from '../../api/services/rew-purchase/reward-purchase.service';
import { RewardPurchase } from '../../api/models/reward-purchase.model';

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

  // Modal states
  showEditModal = false;
  showUserModal = false;
  
  previewAvatar: string | null = null;

  // Form para edición
  editProfileForm: FormGroup;

  // Estadísticas del usuario
  userStats: UserStats = {
    totalPosts: 0,
    totalComments: 0 // Lo dejaremos en 0 por ahora
  };

  // Roles y recompensas
  userRoles: Role[] = [];
  userRewards: RewardPurchase[] = [];
  userCommunities: Community[] = [];

  // Para obtener el ID del usuario (puede venir de la ruta o del usuario logueado)
  userId: number | null = null;

  // Lista de usuarios que se han logueado en el dispositivo
  loggedUsers: User[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private postService: PostService,
    private communityService: CommunityService,
    private rewardService: RewardService,
    private route: ActivatedRoute,
    private router: Router,
    private userStateService: UserStateService,
    private rewPurchaseService: RewardPurchaseService
  ) {
    this.editProfileForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.userId = parseInt(idParam, 10);
        this.loadUserData(this.userId);
      }
    });

    this.loadLoggedUsers();
  }

  private createForm(): FormGroup {
    const form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      avatarUrl: ['', [
      Validators.pattern(/^(https?:\/\/.+\.(jpg|jpeg|png|gif|webp)|.+\.(jpg|jpeg|png|gif|webp))$/i)
      ]]
    });

    // Escuchar cambios en el campo avatarUrl
    form.get('avatarUrl')?.valueChanges.subscribe(value => {
      if (this.showEditModal) {
        this.previewAvatar = value || null;
      }
    });

    return form;
  }

  loadUserData(userId: number): void {
    if (!userId) return;

    this.isLoading = true;
    this.error = null;

    this.userService.getUserById(userId).subscribe({
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
        avatarUrl: this.user.avatar || ''
      });
    }
  }

  private loadUserStats(): void {
    if (!this.userId) return;

    this.postService.getPostsByUser(this.userId).subscribe({
      next: (posts) => {
        this.userStats.totalPosts = posts.length;
      },
      error: (error) => {
        console.error('Error loading user posts:', error);
      }
    });
  }

  private loadUserRolesAndRewards(): void {
    if (!this.userId) return;

    this.communityService.getCommunitiesByUser(this.userId).subscribe({
      next: (communities) => {
        this.userCommunities = communities;
        this.extractUserRoles(communities);
      },
      error: (error) => {
        console.error('Error loading user communities:', error);
      }
    });

    this.rewPurchaseService.getRewardPurchaseById(this.userId).subscribe({
      next: (rewards) => {
        this.userRewards = rewards.slice(0, 5);
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

  // Cargar usuarios que se han logueado (simulado por ahora)
  private loadLoggedUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        // Simular que solo algunos usuarios se han logueado en este dispositivo
        this.loggedUsers = users.slice(0, 3); // Limitar a 3 por ahora
      },
      error: (error) => {
        console.error('Error loading logged users:', error);
      }
    });
  }

  openEditModal(): void {
    this.showEditModal = true;
    this.populateForm();
    this.previewAvatar = null;
    this.error = null;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.previewAvatar = null;
    this.error = null;
    this.editProfileForm.reset();
    this.populateForm();
  }

  saveProfile(): void {
    if (this.editProfileForm.invalid || !this.user) {
      return;
    }
    this.isLoading = true;
    const formData = this.editProfileForm.value;

    // Crear el usuario completo con los campos actualizados
    const updatedUser: UserDTO = {
      ...this.user,
      username: formData.username,
      avatar: formData.avatarUrl?.trim() || null
    };

    console.log('Enviando usuario actualizado:', updatedUser);

    this.userService.updateUser(this.user.id, updatedUser).subscribe({
      next: (u) => {
        this.user = u;

        this.showEditModal = false; this.isLoading = false; 
        this.previewAvatar = null; 
        
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
    if (this.userId) {
      this.loadUserData(this.userId);
    }
  }

  // Funciones para el modal de cambio de usuario
  toggleUserModal(): void {
    this.showUserModal = !this.showUserModal;
  }

  switchToUser(user: User): void {
    this.userStateService.save(user.username);
    this.router.navigate(['/user/perfil', user.id]);
    this.showUserModal = false;
  }

  closeModal(): void {
    this.showUserModal = false;
  }

  removeAvatar(): void {
    this.editProfileForm.patchValue({
      avatarUrl: ''
    });
    this.previewAvatar = null;
  }

  getUserAvatar(user: User | null): string {
    if (!user) return '/default-avatar.png';

    // Si estamos en modo edición o en el modal de edición y hay una URL de preview, usarla
    if (this.showEditModal && this.previewAvatar) {
      return this.previewAvatar;
    }

    return user.avatar || '/default-avatar.png';
  }

  // Funciones utilitarias
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

  /*getRewardTypeIcon(rewardType: string): string {
    const icons: { [key: string]: string } = {
      'badge': '🏆',
      'achievement': '🎖️',
      //⭐, 👑, 🎁, etc.
    };
    return icons[rewardType.toLowerCase()] || icons['default'];
  }*/

  // Getters para errores de validación
  get usernameErrors(): string {
    const control = this.editProfileForm.get('username');
    if (control?.errors) {
      if (control.errors['required']) return 'El nombre de usuario es requerido';
      if (control.errors['minlength']) return 'Mínimo 3 caracteres'; if (control.errors['maxlength']) return 'Máximo 20 caracteres';
      if (control.errors['pattern']) return 'Solo letras, números y guiones bajos';
    }   return '';
  }

  get avatarUrlErrors(): string {
    const control = this.editProfileForm.get('avatarUrl');
    if (control?.errors) {
      if (control.errors['pattern']) return 'Debe ser una URL válida de imagen (jpg, png, gif, webp)';
    }   return '';
  }
}