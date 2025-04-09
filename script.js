document.addEventListener('DOMContentLoaded', () => {
    const colorThief = new ColorThief();
    let history = { extract: [], wheel: [], table: [] };
    let redoStack = { extract: [], wheel: [], table: [] };
    let currentTab = 'extract';

    // Alternância de Tema
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.body.removeAttribute('data-theme');
            themeToggle.textContent = '☀️';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '🌙';
        }
    });

    // Abas
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
            currentTab = tab.dataset.tab;
        });
    });

    // Extrair Temas
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const colorPalette = document.getElementById('color-palette');
    const variationsDiv = document.getElementById('variations');
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            imagePreview.innerHTML = '';
            imagePreview.appendChild(img);
            img.onload = () => {
                const colors = colorThief.getPalette(img, 5);
                renderPalette(colors, colorPalette, variationsDiv, 'extract');
                history.extract.push(colors);
                redoStack.extract = [];
            };
        }
    });

    // Disco de Cores
    const baseColor = document.getElementById('base-color');
    const harmonySelect = document.getElementById('harmony');
    const harmonyPalette = document.getElementById('harmony-palette');
    function updateHarmony() {
        const hex = baseColor.value;
        const rgb = hexToRgb(hex);
        let colors = [rgb];
        switch (harmonySelect.value) {
            case 'analogous':
                colors.push(adjustHue(rgb, 30), adjustHue(rgb, -30));
                break;
            case 'monochromatic':
                colors.push(lighten(rgb, 20), darken(rgb, 20));
                break;
            case 'triad':
                colors.push(adjustHue(rgb, 120), adjustHue(rgb, -120));
                break;
            case 'complementary':
                colors.push(adjustHue(rgb, 180));
                break;
        }
        renderPalette(colors, harmonyPalette, null, 'wheel');
        history.wheel.push(colors);
        redoStack.wheel = [];
    }
    baseColor.addEventListener('change', updateHarmony);
    harmonySelect.addEventListener('change', updateHarmony);
    updateHarmony();

    // Tabela Cromática
    const colorTable = document.getElementById('color-table');
    const tableVariations = document.getElementById('table-variations');
    const predefinedColors = [
        '#FF5733', '#33FF57', '#3357FF', '#FF33A1',
        '#FFD700', '#8A2BE2', '#00CED1', '#FF4500'
    ].map(hexToRgb);
    renderPalette(predefinedColors, colorTable, tableVariations, 'table');
    history.table.push(predefinedColors);

    // Renderização de Paleta e Variações
    function renderPalette(colors, container, variationsContainer, tab) {
        container.innerHTML = '';
        colors.forEach(rgb => {
            const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
            const block = document.createElement('div');
            block.className = 'color-block';
            block.style.backgroundColor = hex;
            block.innerHTML = `${hex}<br>RGB: ${rgb.join(', ')}`;
            block.addEventListener('click', () => {
                if (variationsContainer) {
                    variationsContainer.innerHTML = '';
                    const variations = [
                        lighten(rgb, 20), darken(rgb, 20),
                        adjustHue(rgb, 15), adjustHue(rgb, -15)
                    ];
                    variations.forEach(varRgb => {
                        const varHex = rgbToHex(varRgb[0], varRgb[1], varRgb[2]);
                        const varBlock = document.createElement('div');
                        varBlock.className = 'color-block';
                        varBlock.style.backgroundColor = varHex;
                        varBlock.innerHTML = `${varHex}<br>RGB: ${varRgb.join(', ')}`;
                        variationsContainer.appendChild(varBlock);
                    });
                }
            });
            container.appendChild(block);
        });
    }

    // Ferramentas
    document.getElementById('undo').addEventListener('click', () => {
        if (history[currentTab].length > 1) {
            redoStack[currentTab].push(history[currentTab].pop());
            const lastColors = history[currentTab][history[currentTab].length - 1];
            const container = currentTab === 'extract' ? colorPalette : currentTab === 'wheel' ? harmonyPalette : colorTable;
            const variations = currentTab === 'extract' ? variationsDiv : currentTab === 'table' ? tableVariations : null;
            renderPalette(lastColors, container, variations, currentTab);
        }
    });

    document.getElementById('redo').addEventListener('click', () => {
        if (redoStack[currentTab].length > 0) {
            const colors = redoStack[currentTab].pop();
            history[currentTab].push(colors);
            const container = currentTab === 'extract' ? colorPalette : currentTab === 'wheel' ? harmonyPalette : colorTable;
            const variations = currentTab === 'extract' ? variationsDiv : currentTab === 'table' ? tableVariations : null;
            renderPalette(colors, container, variations, currentTab);
        }
    });

    document.getElementById('fullscreen').addEventListener('click', () => document.body.requestFullscreen());
    document.getElementById('share').addEventListener('click', () => alert('Compartilhar em breve!'));
    document.getElementById('download').addEventListener('click', () => {
        html2canvas(document.querySelector('.content.active')).then(canvas => {
            const link = document.createElement('a');
            link.download = 'XperiColor_palette.jpg';
            link.href = canvas.toDataURL('image/jpeg');
            link.click();
        });
    });

    // Modal de Instruções
    const instructionsBtn = document.getElementById('instructions');
    const modal = document.getElementById('instructions-modal');
    const closeModal = document.getElementById('close-modal');
    instructionsBtn.addEventListener('click', () => modal.style.display = 'flex');
    closeModal.addEventListener('click', () => modal.style.display = 'none');

    // Funções Auxiliares
    function rgbToHex(r, g, b) {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    }

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
    }

    function adjustHue(rgb, degrees) {
        const hsl = rgbToHsl(rgb);
        hsl[0] = (hsl[0] + degrees) % 360;
        return hslToRgb(hsl);
    }

    function lighten(rgb, amount) {
        const hsl = rgbToHsl(rgb);
        hsl[2] = Math.min(100, hsl[2] + amount);
        return hslToRgb(hsl);
    }

    function darken(rgb, amount) {
        const hsl = rgbToHsl(rgb);
        hsl[2] = Math.max(0, hsl[2] - amount);
        return hslToRgb(hsl);
    }

    function rgbToHsl(rgb) {
        let r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [h * 360, s * 100, l * 100];
    }

    function hslToRgb(hsl) {
        let h = hsl[0] / 360, s = hsl[1] / 100, l = hsl[2] / 100;
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hueToRgb(p, q, h + 1/3);
            g = hueToRgb(p, q, h);
            b = hueToRgb(p, q, h - 1/3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    function hueToRgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }
});
