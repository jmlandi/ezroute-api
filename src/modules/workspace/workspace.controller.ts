import { Controller, HttpCode, HttpStatus, Body, Request, Post, Get, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './workspace.dto';
import { AuthGuard } from '../auth/auth.guard';
import { WorkspaceService } from './workspace.service';

@Controller('api/workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getWorkspace(@Param('id') id: string) {
    return this.workspaceService.findById(id);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async getMyWorkspaces(@Request() request: any) {
    const userId = request.user?.sub;
    return this.workspaceService.findByOwnerId(userId);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createWorkspace(@Request() request: any, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    const userId = request.user?.sub;
    return this.workspaceService.create(userId, createWorkspaceDto.name);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async updateWorkspace(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.update(
      id,
      updateWorkspaceDto.name || null,
      updateWorkspaceDto.status || null,
    );
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteWorkspace(@Param('id') id: string) {
    return this.workspaceService.delete(id);
  }

}
