"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesModule = void 0;
const common_1 = require("@nestjs/common");
const qr_code_controller_1 = require("./qr-code.controller");
const qr_code_service_1 = require("./qr-code.service");
const pdf_controller_1 = require("./pdf.controller");
const pdf_service_1 = require("./pdf.service");
const files_service_1 = require("./files.service");
let FilesModule = class FilesModule {
};
exports.FilesModule = FilesModule;
exports.FilesModule = FilesModule = __decorate([
    (0, common_1.Module)({
        controllers: [qr_code_controller_1.QrCodeController, pdf_controller_1.PdfController],
        providers: [qr_code_service_1.QrCodeService, pdf_service_1.PdfService, files_service_1.FilesService],
        exports: [qr_code_service_1.QrCodeService, pdf_service_1.PdfService, files_service_1.FilesService],
    })
], FilesModule);
//# sourceMappingURL=files.module.js.map