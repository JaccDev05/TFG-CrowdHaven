import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Community } from '../../../api/models/community.model';
import { Post } from '../../../api/models/post.model';
import { CommunityService } from '../../../api/services/community/community.service';
import { PostService } from '../../../api/services/post/post.service';
import { MemberCommunityService } from '../../../api/services/member-community/member-community.service';
import { MemberCommunityDTO } from '../../../api/dtos/member-community-dto';
import { RoleService } from '../../../api/services/role/role.service';
import { PostDTO } from '../../../api/dtos/post-dto';
import { CommunityDTO } from '../../../api/dtos/community-dto';
import { FormsModule } from '@angular/forms';
import { last } from 'rxjs';
import { User } from '../../../api/models/user.model';
import { UserService } from '../../../api/services/user/user.service';
import { PopupService } from '../../../PagInicio/loginservices/popup.service';
import { RoleDTO } from '../../../api/dtos/role-dto';
import { Role } from '../../../api/models/role.model';
import { UserStateService } from '../../../PagInicio/loginservices/user-state.service';

@Component({
  selector: 'app-community-details',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './community-details.component.html',
  styleUrl: './community-details.component.scss'
})
export class CommunityDetailsComponent implements OnInit {
  community: Community = {} as Community;
  posts: Post[] = [];
  roles: Role[] = [];
  communityId: number = 0;
  userId: number = 0;
  error: string | null = null;
  loading: boolean = true;
  isMember: boolean = false;
  isOwner: boolean = false;
  joiningCommunity: boolean = false;
  user!: User;

  // Variables para edición de comunidad
  editMode: boolean = false;
  updatingCommunity: boolean = false;
  editCommunityData: CommunityDTO = {
    name: '',
    description: '',
    img_photo: '',
    img_banner: '',
    user: ''
  };

  newPost: PostDTO = {
    userId: 0,
    communityId: 0,
    title: '',
    content: '',
    image: ''
  };
  posting: boolean = false;
  creatingRole: boolean = false;
  newRoleName = '';
  selectedRole: Role = {} as Role;
  showAssignRoleModal = false;
  selectedUsername: string = '';
  selectedUserId: number = 0;
  selectedNewRoleName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private communityService: CommunityService,
    private postService: PostService,
    private memberCommunityService: MemberCommunityService,
    private roleService: RoleService,
    private userService: UserService,
    private popupService: PopupService,
    private userStateService: UserStateService

  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = Number(params['userId']);
      this.communityId = Number(params['communityId']);
      this.loadCommunityData();
      this.loadCommunityPosts();
      this.checkMembership();
      this.getUser();
      this.loadRoles();
    });

  }

  getUser(): void {
    this.userService.getUserById(this.userId).subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        this.error = 'Error al cargar el usuario';
        console.error(err);
      }
    });
  }


  loadCommunityData(): void {
    this.communityService.getCommunityById(this.communityId).subscribe({
      next: (data) => {
        this.community = data;
        this.checkOwnership();
        this.loading = false;

      },
      error: (err) => {
        this.error = 'Error al cargar la comunidad';
        this.loading = false;
        console.error(err);
      }
    });
  }

  checkOwnership(): void {
    if (!this.community.user) return;

    this.isOwner = this.community.user.id === this.userId;

    // Paso 1: Obtener roles de la comunidad
    this.roleService.getRolesByCommunity(this.communityId).subscribe({
      next: (roles) => {
        if (!roles || roles.length === 0) {
          console.warn('No se encontraron roles para esta comunidad');
          return;
        }

        const firstRole = roles[0];

        const dto = {
          userId: this.userId,
          communityId: this.communityId,
          roleId: firstRole.id // Asignar primer rol disponible
        };

        // Paso 2: Obtener todos los miembros de la comunidad
        this.memberCommunityService.getUsersByCommunity(this.communityId).subscribe({
          next: (members) => {
            // Paso 3: Verificar si ya existe una combinación igual
            const yaExiste = members.some((member: any) =>
              member.user.id === dto.userId &&
              member.community.id === dto.communityId &&
              member.role.id === dto.roleId
            );

            if (yaExiste) {
              console.log('El usuario ya pertenece a la comunidad con ese rol.');
              return; // Detener ejecución
            }

            // Paso 4: Si no existe, enviar la solicitud
            this.memberCommunityService.addUserToCommunity(dto).subscribe({
              next: () => {
                console.log('Usuario unido a la comunidad');
              },
              error: (err) => {
                console.error('Error al unirse a la comunidad', err);
              }
            });
          },
          error: (err) => {
            console.error('Error al obtener miembros de la comunidad', err);
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener los roles de la comunidad', err);
      }
    });
  }

  loadCommunityPosts(): void {
    this.postService.getPostsByCommunity(this.communityId).subscribe({
      next: (data) => {
        this.posts = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },
      error: (err) => {
        this.error = 'Error al cargar las publicaciones';
        console.error(err);
      }
    });
  }

  checkMembership(): void {
    this.memberCommunityService.getCommunitiesByUser(this.userId).subscribe({
      next: (communities) => {
        this.isMember = communities.some(community => community.id === this.communityId);
      },
      error: (err) => {
        console.error('Error al verificar membresía', err);
      }
    });
  }

  toggleEditMode(): void {
    if (!this.editMode) {
      // Inicializar datos de edición con los valores actuales
      this.editCommunityData = {
        name: this.community.name,
        description: this.community.description,
        img_photo: this.community.img_photo,
        img_banner: this.community.img_banner,
        user: this.community.user.username
      };
    }
    this.editMode = !this.editMode;
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editCommunityData = {
      name: '',
      description: '',
      img_photo: '',
      img_banner: '',
      user: ''
    };
  }


  updateCommunity(): void {
    if (!this.editCommunityData.name || !this.editCommunityData.description) {
      console.log('Datos incompletos:', this.editCommunityData);
      return;
    }

    console.log('Iniciando actualización de comunidad:', this.editCommunityData);
    this.updatingCommunity = true;

    // Crear el objeto Community completo que espera el backend
    const communityUpdate: Community = {
      id: this.community.id,
      name: this.editCommunityData.name,
      description: this.editCommunityData.description,
      img_photo: this.editCommunityData.img_photo,
      img_banner: this.editCommunityData.img_banner,
      user: this.community.user, // Mantener el objeto User completo original
      createdAt: this.community.createdAt,
      updatedAt: this.community.updatedAt,
      roles: this.community.roles || [],
      members: this.community.members || []
    };

    this.communityService.updateCommunity(this.communityId, communityUpdate).subscribe({
      next: (updatedCommunity) => {
        console.log('Comunidad actualizada exitosamente:', updatedCommunity);
        this.community = updatedCommunity;
        this.editMode = false;
        this.updatingCommunity = false;
        this.cancelEdit();
        this.popupService.showMessage(
          'Comunidad actualizada exitosamente',
          'Campos actualizados correctamente',
          'success'
        )

      },
      error: (err) => {
        console.error('Error al actualizar la comunidad:', err);
        this.updatingCommunity = false;
        alert('Error al actualizar la comunidad: ' + (err.message || err.error?.message || 'Error desconocido'));
      }
    });
  }

  joinCommunity(): void {
    if (this.joiningCommunity) return;

    this.joiningCommunity = true;

    this.roleService.getRolesByCommunity(this.communityId).subscribe({
      next: (roles) => {
        if (!roles || roles.length === 0) {
          console.warn('No se encontraron roles para esta comunidad');
          this.joiningCommunity = false;
          return;
        }

        const firstRole = roles[0]; // ✅ Se asigna el primer rol

        const memberDTO: MemberCommunityDTO = {
          userId: this.userId,
          communityId: this.communityId,
          roleId: firstRole.id // ✅ Se usa el ID del primer rol
        };

        this.memberCommunityService.addUserToCommunity(memberDTO).subscribe({
          next: () => {
            this.isMember = true;
            this.joiningCommunity = false;
            this.loadCommunityData(); // ✅ Recarga datos de la comunidad si es necesario
          },
          error: (err) => {
            this.joiningCommunity = false;
            console.error('Error al unirse a la comunidad:', err);
          }
        });
      },
      error: (err) => {
        this.joiningCommunity = false;
        console.error('Error al obtener roles de la comunidad:', err);
      }
    });
  }


  leaveCommunity(): void {
    this.memberCommunityService.removeUserFromCommunity(this.userId, this.communityId).subscribe({
      next: () => {
        this.isMember = false;
        // Recargar
        this.loadCommunityData();
      },
      error: (err) => {
        console.error('Error al salir de la comunidad', err);
      }
    });
  }

  submitPost(): void {
    if (!this.newPost.title || !this.newPost.content) return;

    this.posting = true;
    this.newPost.userId = this.userId;
    this.newPost.communityId = this.communityId;

    this.postService.createPost(this.newPost).subscribe({
      next: (createdPost) => {
        this.posts.unshift(createdPost); // Añadirlo arriba
        this.newPost = { userId: this.userId, communityId: this.communityId, title: '', content: '', image: '' };
        this.posting = false;

        if (this.user) {
          const dto = {
            email: this.user.email,
            username: this.user.username,
            avatar: this.user.avatar,
            crowdCoin: this.user.crowdCoin + 30
          }

          this.userService.updateCrowdCoins(this.user.id, dto).subscribe();

          this.popupService.showMessage(
            '¡Post creado!',
            'Tu post ha sido creado con éxito,  has ganado  +30 CrowdCoins',
            'success'
          );
        }

      },
      error: (err) => {
        console.error('Error al crear el post', err);
        this.posting = false;
      }
    });
  }


  likePost(postId: number): void {
    this.postService.updatePostReaction(postId, true).subscribe({
      next: (updatedPost) => {
        const index = this.posts.findIndex(p => p.id === postId);
        if (index !== -1) {
          this.posts[index] = updatedPost;
        }
      },
      error: (err) => {
        console.error('Error al dar like', err);
      }
    });
  }

  dislikePost(postId: number): void {
    this.postService.updatePostReaction(postId, false).subscribe({
      next: (updatedPost) => {
        const index = this.posts.findIndex(p => p.id === postId);
        if (index !== -1) {
          this.posts[index] = updatedPost;
        }
      },
      error: (err) => {
        console.error('Error al dar dislike', err);
      }
    });
  }

  commentOnPost(postId: number): void {
    this.router.navigate([`/posts/${postId}`]);
  }

  toggleRole() {
    this.creatingRole = !this.creatingRole;
  }

  submitRole() {
    if (this.newRoleName) {

      const dto: RoleDTO = {
        roleName: this.newRoleName,
        community: this.community.name,
      };

      this.roleService.addRoleToCommunity(dto).subscribe({
        next: (rol) => {
          this.popupService.showMessage(
            '¡Rol creado!',
            'El rol ha sido creado con éxito',
            'success'
          )
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
        error: (err) => {
          this.popupService.showMessage(
            'Error al crear el rol',
            'Hubo un error al crear el rol',
            'error'
          )
        }
      })
      this.newRoleName = '';
      this.editMode = false;
    }
  }

  openAssignRoleModal(username: string) {
    this.selectedUsername = username;
    this.showAssignRoleModal = true;
  }

  toggleAssignRoleModal() {
    this.showAssignRoleModal = false;
  }

  loadRoles() {
    this.roleService.getRolesByCommunity(this.communityId).subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (err) => {
        console.error('Error al obtener roles de la comunidad:', err);
      }
    });
  }

  assignRole() {
    this.userService.getUserProfile(this.selectedUsername).subscribe({
      next: (user) => {
        this.selectedUserId = user.id;
  
        // Solo una vez obtenido el ID del usuario, asignamos el rol
        this.memberCommunityService.assignRoleToMember(
          this.selectedUserId,
          this.communityId,
          this.selectedRole.id // ¡asegúrate de que selectedRole es un objeto!
        ).subscribe({
          next: (c) => {
            this.selectedNewRoleName = c.role.roleName
            this.popupService.showMessage(
              '¡Rol asignado!',
              'El rol ha sido asignado con éxito',
              'success'
            );
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          },
          error: (err) => {
            this.popupService.showMessage(
              'Error al asignar el rol',
              'Hubo un error al asignar el rol',
              'error'
            );
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener el usuario:', err);
      }
    });
  }
  
}