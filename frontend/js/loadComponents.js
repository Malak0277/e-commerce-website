async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

function loadAllComponents() {
    loadComponent('header-component', '../common/header.html');
    loadComponent('scripts-component', '../common/scripts.html');
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', loadAllComponents); 