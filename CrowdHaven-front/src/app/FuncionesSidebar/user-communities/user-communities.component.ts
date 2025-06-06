import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Community } from '../../api/models/community.model';
import { CommunityService } from '../../api/services/community/community.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MemberCommunityService } from '../../api/services/member-community/member-community.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserStateService } from '../../PagInicio/loginservices/user-state.service';
import { PopupService } from '../../PagInicio/loginservices/popup.service';
import { RoleService } from '../../api/services/role/role.service';
import { RoleDTO } from '../../api/dtos/role-dto';

@Component({
  selector: 'app-user-communities',
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-communities.component.html',
  styleUrl: './user-communities.component.scss'
})
export class UserCommunitiesComponent implements OnInit {

  communities: Community[] = [];
  ownedCommunities: Community[] = [];
  userId: string | null = null;
  showModal: boolean = false;
  communityForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private comService: MemberCommunityService,
    private communityService: CommunityService,
    private fb: FormBuilder,
    private userStateService: UserStateService,
    private popupService: PopupService,
    private roleService: RoleService
    
  ) {

    this.communityForm = this.fb.group({
      name: ['', Validators.required],
      description:[''] ,
      img_photo: [''],
      img_banner: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const userId = parseInt(idParam, 10);
        this.loadCommunities(userId);
        this.loadOwnedCommunities(userId);
      }
    });
    this.userId = this.route.snapshot.paramMap.get('id');
  }

  loadCommunities(userId: number): void {
    this.comService.getCommunitiesByUser(userId).subscribe((data) => {
      // Filtra comunidades duplicadas por ID
      const uniqueCommunities = data.filter((community, index, self) =>
        index === self.findIndex(c => c.id === community.id)
      );
  
      // Ordena por cantidad de miembros descendente
      this.communities = uniqueCommunities.sort((a, b) => b.members.length - a.members.length);
    });
  }

  loadOwnedCommunities(userId: number): void {
    this.communityService.getCommunitiesByUser(userId).subscribe((data) => {
      // Filtra comunidades duplicadas por ID
      const uniqueCommunities = data.filter((community, index, self) =>
        index === self.findIndex(c => c.id === community.id)
      );
  
      // Ordena por cantidad de miembros descendente
      this.ownedCommunities = uniqueCommunities.sort((a, b) => b.members.length - a.members.length);
    });
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.communityForm.reset(); // opcional
  }
  
  submitForm(): void {
    if (this.communityForm.valid) {
      const username = this.userStateService.getUsername();
  
      const CommunityDTO = {
        name: this.communityForm.value.name,
        description: this.communityForm.value.description,
        img_photo: this.communityForm.value.img_photo,
        img_banner: this.communityForm.value.img_banner,
        user: username
      };
  
      this.communityService.createCommunity(CommunityDTO).subscribe({
        next: (createdCommunity) => {
          // ✅ Crear el rol después de crear la comunidad
          const roleDTO: RoleDTO = {
            roleName: 'Miembro',
            community: createdCommunity.name // Asegúrate de usar el nombre real devuelto por el backend
          };
  
          this.roleService.addRoleToCommunity(roleDTO).subscribe({
            next: () => {
              this.popupService.showMessage(
                'Comunidad creada',
                'Tu comunidad ha sido creada con éxito',
                'success'
              );
  
              this.communityForm.reset();
              this.closeModal();
  
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            },
            error: (err) => {
              this.popupService.close();
              this.popupService.showMessage(
                'Error al crear el rol',
                'La comunidad fue creada, pero el rol no se pudo asignar.',
                'error'
              );
              console.error('Error al crear el rol', err);
            }
          });
        },
        error: (err) => {
          this.popupService.close();
          this.popupService.showMessage(
            'Ups, ocurrió un error',
            'No se pudo crear la comunidad. Inténtalo más tarde.',
            'error'
          );
          console.error('Error al crear comunidad', err);
        }
      });
    }
  }
  
}
