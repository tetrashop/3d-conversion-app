export class FormatConverter {
    static supportedFormats = ['obj', 'stl', 'fbx', 'gltf', 'glb'];

    static async convertFile(inputFile, outputFormat) {
        // شبیه‌سازی تبدیل فایل
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    originalFile: inputFile.name,
                    convertedFile: `converted_${Date.now()}.${outputFormat}`,
                    format: outputFormat,
                    size: Math.round(inputFile.size * 0.8), // 20% بهینه‌سازی
                    status: 'success'
                });
            }, 2000);
        });
    }

    static validateFormat(format) {
        return this.supportedFormats.includes(format.toLowerCase());
    }
}
