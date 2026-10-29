const API_URL = 'backend/api/api.php';

const btnShowForm = document.getElementById('btn-show-form');
const btnCancelForm = document.getElementById('btn-cancel-form');
const sectionForm = document.getElementById('section-form');
const formCategorie = document.getElementById('form-categorie');
const tableBody = document.getElementById('table-categories-body');
const btnSubmit = document.getElementById('btn-submit');
const btnText = document.getElementById('btn-text');
const btnSpinner = document.getElementById('btn-spinner');

// Sidebar responsive drawer listeners
const sidebar = document.getElementById('sidebar');
const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
const btnCloseSidebar = document.getElementById('btn-close-sidebar');

btnToggleSidebar?.addEventListener('click', () => sidebar.classList.toggle('-translate-x-full'));
btnCloseSidebar?.addEventListener('click', () => sidebar.classList.add('-translate-x-full'));

btnShowForm.addEventListener('click', () => sectionForm.classList.toggle('hidden'));
btnCancelForm.addEventListener('click', () => sectionForm.classList.add('hidden'));

// Toast notification using Tailwind
const showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const bgColors = type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white';
    
    toast.className = `px-4 py-2 rounded shadow-lg text-sm font-medium transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto ${bgColors}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    setTimeout(() => toast.classList.remove('translate-y-2', 'opacity-0'), 50);

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Fetch products from backend
const loadProducts = async () => {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
            tableBody.innerHTML = data.map(p => `
                <tr class="hover:bg-gray-50">
                    <td class="p-4 text-gray-500">#${p.id}</td>
                    <td class="p-4 font-medium text-gray-900">${p.name}</td>
                    <td class="p-4">
                        <span class="inline-block bg-primary-50 text-primary-600 px-2 py-1 rounded text-xs font-semibold mr-2">${p.price} $</span>
                        <span class="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">Size: ${p.size}</span>
                    </td>
                </tr>`).join('');
        } else {
            tableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-gray-500">No products found.</td></tr>';
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Failed to load products.', 'error');
    }
};

// Form submit with loading state
formCategorie.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const payload = {
        name: document.getElementById('cat-nom').value,
        price: document.getElementById('cat-couleur').value,
        size: document.getElementById('cat-icone').value
    };

    // Disable button & show spinner
    btnSubmit.disabled = true;
    btnText.textContent = 'Saving...';
    btnSpinner.classList.remove('hidden');

    try {
        const res = await fetch(API_URL, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload) 
        });
        const result = await res.json();
        
        if (res.ok && result.success) {
            formCategorie.reset();
            sectionForm.classList.add('hidden');
            showToast(result.message, 'success');
            loadProducts();
        } else {
            showToast(result.message || 'An error occurred.', 'error');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showToast('Network error while saving.', 'error');
    } finally {
        // Reset submit button state
        btnSubmit.disabled = false;
        btnText.textContent = 'Save';
        btnSpinner.classList.add('hidden');
    }
});

loadProducts();