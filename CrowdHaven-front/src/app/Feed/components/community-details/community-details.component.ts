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

@Component({
  selector: 'app-community-details',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './community-details.component.html',
  styleUrl: './community-details.component.scss'
})
export class CommunityDetailsComponent implements OnInit {
  community: Community = {} as Community;
  posts: Post[] = [];
  communityId: number = 0;
  userId: number = 0;
  error: string | null = null;
  loading: boolean = true;
  isMember: boolean = false;
  isOwner: boolean = false;
  joiningCommunity: boolean = false;
  
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
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private communityService: CommunityService,
    private postService: PostService,
    private memberCommunityService: MemberCommunityService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = Number(params['userId']);
      this.communityId = Number(params['communityId']);
      this.loadCommunityData();
      this.loadCommunityPosts();
      this.checkMembership();
    
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
    this.isOwner = this.community.user.id === this.userId;
    const dto = {
      userId: this.userId,
      communityId: this.communityId,
      roleId: 13
    }

    this.memberCommunityService.addUserToCommunity(dto).subscribe({
      next: () => {
        
      },
      error: (err) => {
      
        console.error('Error al unirse a la comunidad', err);
      }
    })
  }

  loadCommunityPosts(): void {
    this.postService.getPostsByCommunity(this.communityId).subscribe({
      next: (data) => {
        this.posts = data;
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

  /*updateCommunity(): void {
    if (!this.editCommunityData.name || !this.editCommunityData.description) {
      console.log('Datos incompletos:', this.editCommunityData);
      return;
    }

    console.log('Iniciando actualización de comunidad:', this.editCommunityData);
    this.updatingCommunity = true;

    // Verificar si el método existe en el servicio
    if (!this.communityService.updateCommunity) {
      console.error('El método updateCommunity no existe en CommunityService');
      this.updatingCommunity = false;
      alert('Error: Método de actualización no implementado');
      return;
    }

    this.communityService.updateCommunity(this.communityId, this.editCommunityData).subscribe({
      next: (updatedCommunity) => {
        console.log('Comunidad actualizada exitosamente:', updatedCommunity);
        this.community = updatedCommunity;
        this.editMode = false;
        this.updatingCommunity = false;
        this.cancelEdit();
        alert('Comunidad actualizada exitosamente');
      },
      error: (err) => {
        console.error('Error al actualizar la comunidad:', err);
        this.updatingCommunity = false;
        alert('Error al actualizar la comunidad: ' + (err.message || err.error?.message || 'Error desconocido'));
      }
    });
  }*/

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
          alert('Comunidad actualizada exitosamente');
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
        if (roles.length === 0) {
          console.error('No hay roles en la comunidad');
          this.joiningCommunity = false;
          return;
        }
  
        const firstRole = roles[0];
  
        const memberDTO: MemberCommunityDTO = {
          userId: this.userId,
          communityId: this.communityId,
          roleId: firstRole.id
        };
  
        this.memberCommunityService.addUserToCommunity(memberDTO).subscribe({
          next: () => {
            this.isMember = true;
            this.joiningCommunity = false;
            this.loadCommunityData();
          },
          error: (err) => {
            this.joiningCommunity = false;
            console.error('Error al unirse a la comunidad', err);
          }
        });
      },
      error: (err) => {
        this.joiningCommunity = false;
        console.error('Error al obtener roles de la comunidad', err);
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
}