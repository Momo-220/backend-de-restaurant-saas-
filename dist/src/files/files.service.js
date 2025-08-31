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
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs = require("fs");
const path = require("path");
let FilesService = class FilesService {
    constructor(configService) {
        this.configService = configService;
        this.uploadsDir = path.join(process.cwd(), 'uploads');
        this.publicDir = path.join(process.cwd(), 'public');
        this.ensureDirectoryExists(this.uploadsDir);
        this.ensureDirectoryExists(this.publicDir);
        this.ensureDirectoryExists(path.join(this.publicDir, 'qr-codes'));
        this.ensureDirectoryExists(path.join(this.publicDir, 'receipts'));
    }
    ensureDirectoryExists(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }
    async saveFile(buffer, filename, subfolder) {
        const targetDir = subfolder
            ? path.join(this.publicDir, subfolder)
            : this.publicDir;
        this.ensureDirectoryExists(targetDir);
        const filePath = path.join(targetDir, filename);
        await fs.promises.writeFile(filePath, buffer);
        const publicUrl = subfolder
            ? `/public/${subfolder}/${filename}`
            : `/public/${filename}`;
        return publicUrl;
    }
    async deleteFile(relativePath) {
        try {
            const fullPath = path.join(process.cwd(), relativePath);
            if (fs.existsSync(fullPath)) {
                await fs.promises.unlink(fullPath);
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Erreur suppression fichier:', error);
            return false;
        }
    }
    getPublicUrl(relativePath) {
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3001';
        return `${frontendUrl}${relativePath}`;
    }
    async getFileBuffer(relativePath) {
        try {
            const fullPath = path.join(process.cwd(), relativePath);
            if (fs.existsSync(fullPath)) {
                return await fs.promises.readFile(fullPath);
            }
            return null;
        }
        catch (error) {
            console.error('Erreur lecture fichier:', error);
            return null;
        }
    }
    generateUniqueFilename(originalName, prefix) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const ext = path.extname(originalName);
        const name = path.basename(originalName, ext);
        return prefix
            ? `${prefix}_${name}_${timestamp}_${random}${ext}`
            : `${name}_${timestamp}_${random}${ext}`;
    }
    async cleanOldFiles(subfolder, maxAgeMs) {
        try {
            const targetDir = path.join(this.publicDir, subfolder);
            if (!fs.existsSync(targetDir))
                return;
            const files = await fs.promises.readdir(targetDir);
            const now = Date.now();
            for (const file of files) {
                const filePath = path.join(targetDir, file);
                const stats = await fs.promises.stat(filePath);
                if (now - stats.mtime.getTime() > maxAgeMs) {
                    await fs.promises.unlink(filePath);
                    console.log(`Fichier ancien supprimé: ${file}`);
                }
            }
        }
        catch (error) {
            console.error('Erreur nettoyage fichiers:', error);
        }
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FilesService);
//# sourceMappingURL=files.service.js.map