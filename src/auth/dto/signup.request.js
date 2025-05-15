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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpRequest = void 0;
const class_validator_1 = require("class-validator");
class SignUpRequest {
}
exports.SignUpRequest = SignUpRequest;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignUpRequest.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignUpRequest.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignUpRequest.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignUpRequest.prototype, "district", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignUpRequest.prototype, "ward", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignUpRequest.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SignUpRequest.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsStrongPassword)({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    }, {
        message: 'Mật khẩu phải dài ít nhất 8 ký tự và bao gồm ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 số và 1 ký hiệu.'
    }),
    __metadata("design:type", String)
], SignUpRequest.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignUpRequest.prototype, "confirmPassword", void 0);
;
