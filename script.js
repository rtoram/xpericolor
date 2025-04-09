document.addEventListener('DOMContentLoaded', () => {
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
        });
    });

    // Upload de Imagem (Simulação Básica)
    const imageUpload = document.getElementById('image-upload');
    const colorPalette = document.getElementById('color-palette');
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Simulação: Gera cores fictícias (substituir por ColorThief depois)
            const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'];
            colorPalette.innerHTML = '';
            colors.forEach(color => {
                const block = document.createElement('div');
                block.className = 'color-block';
                block.style.backgroundColor = color;
                block.innerHTML = `${color}<br>RGB: ${hexToRgb(color)}`;
                block.addEventListener('click', () => alert(`Variações de ${color} em breve!`));
                colorPalette.appendChild(block);
            });
        }
    });

    // Modal de Instruções
    const instructionsBtn = document.getElementById('instructions');
    const modal = document.getElementById('instructions-modal');
    const closeModal = document.getElementById('close-modal');
    instructionsBtn.addEventListener('click', () => modal.style.display = 'flex');
    closeModal.addEventListener('click', () => modal.style.display = 'none');

    // Funções de Ferramentas (Placeholders)
    document.getElementById('undo').addEventListener('click', () => alert('Desfazer em breve!'));
    document.getElementById('redo').addEventListener('click', () => alert('Refazer em breve!'));
    document.getElementById('fullscreen').addEventListener('click', () => document.body.requestFullscreen());
    document.getElementById('share').addEventListener('click', () => alert('Compartilhar em breve!'));
    document.getElementById('download').addEventListener('click', () => alert('Download em breve!'));

    // Função auxiliar para converter HEX para RGB
    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
    }
});
