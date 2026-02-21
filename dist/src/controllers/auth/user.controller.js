"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const auth_1 = require("../../contracts/auth");
const user_password_dto_1 = require("../../contracts/auth/user-password.dto");
const user_service_1 = require("../../services/auth/user.service");
const swagger_paginated_schema_1 = require("../../contracts/pagination/swagger.paginated.schema");
const pagination_dto_1 = require("../../contracts/pagination/pagination.dto");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    getAll() {
        return this.userService.getAll();
    }
    getUserPaginated(data) {
        return this.userService.getUserPaginated(data);
    }
    getById(userId) {
        return this.userService.getById(userId);
    }
    create(dto) {
        return this.userService.create(dto);
    }
    update(id, dto) {
        return this.userService.update(id, dto);
    }
    updatePassword(id, dto) {
        return this.userService.updatePassword(id, dto);
    }
    delete(userId) {
        return this.userService.delete(userId);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'List all users',
        description: 'Retrieve all users registered in the system.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved all users',
        type: [auth_1.UserResponse],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('paginated'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get service types filtered and paginated',
        description: 'Get service types filtered and paginated',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Success',
        schema: (0, swagger_paginated_schema_1.PaginatedResponseSchema)(auth_1.UserResponse),
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserPaginated", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user by ID',
        description: 'Retrieve details of a specific user identified by its ID.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved user details',
        type: auth_1.UserResponse,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new user',
        description: 'Register a new user in the system.',
    }),
    (0, swagger_1.ApiBody)({
        description: 'User data to be registered',
        type: auth_1.UserDto,
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'User successfully created',
        type: auth_1.UserResponse,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_1.UserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Update an existing user',
        description: 'Update the data of an existing user identified by its ID.',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Updated user data',
        type: auth_1.UserDto,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'User successfully updated',
        type: auth_1.UserResponse,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, auth_1.UserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Update an existing user',
        description: 'Update the data of an existing user identified by its ID.',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Updated user data',
        type: auth_1.UserDto,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'User password successfully updated',
        type: auth_1.UserResponse,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_password_dto_1.UserPasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a user',
        description: 'Perform a soft delete of a user identified by its ID.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'User successfully deleted',
        type: auth_1.UserResponse,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map