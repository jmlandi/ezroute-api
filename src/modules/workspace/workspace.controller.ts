import { Controller, HttpCode, HttpStatus, Body, Request, Post, Get, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './workspace.dto';
import { AuthGuard } from '../auth/auth.guard';
import { WorkspaceService } from './workspace.service';

@ApiTags('Workspace')
@Controller('api/workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get workspace by ID' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  @ApiResponse({ status: 200, description: 'Workspace retrieved' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getWorkspace(@Param('id') id: string) {
    return this.workspaceService.findById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all workspaces for current user' })
  @ApiResponse({ status: 200, description: 'List of workspaces' })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async getMyWorkspaces(@Request() request: any) {
    const userId = request.user?.sub;
    return this.workspaceService.findByOwnerId(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new workspace' })
  @ApiResponse({ status: 201, description: 'Workspace created' })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createWorkspace(@Request() request: any, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    const userId = request.user?.sub;
    return this.workspaceService.create(userId, createWorkspaceDto.name);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update workspace' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  @ApiResponse({ status: 200, description: 'Workspace updated' })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete workspace' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  @ApiResponse({ status: 200, description: 'Workspace deleted' })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteWorkspace(@Param('id') id: string) {
    return this.workspaceService.delete(id);
  }

}
