document.addEventListener('DOMContentLoaded', () => {
    const charactersButton = document.getElementById('fetchAllCharacters');
    const filterForm = document.getElementById('filterForm');

    charactersButton.addEventListener('click', fetchAllCharacters);
    filterForm.addEventListener('submit', fetchFilteredCharacters);

    function fetchAllCharacters() {
        fetchCharacters('https://rickandmortyapi.com/api/character');
    }

    function fetchFilteredCharacters(event) {
        event.preventDefault();
        let query = 'https://rickandmortyapi.com/api/character/?';
        const name = document.getElementById('name').value.trim();
        const status = document.getElementById('status').value.trim();
        const species = document.getElementById('species').value.trim();
        const type = document.getElementById('type').value.trim();
        const gender = document.getElementById('gender').value.trim();

        if (name) query += `name=${name}&`;
        if (status) query += `status=${status}&`;
        if (species) query += `species=${species}&`;
        if (type) query += `type=${type}&`;
        if (gender) query += `gender=${gender}&`;

        fetchCharacters(query.slice(0, -1));  // Remove trailing "&"
    }

    function fetchCharacters(url) {
        let allCharacters = [];

        function fetchPage(url) {
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    allCharacters = allCharacters.concat(data.results);
                    if (data.info.next) {
                        fetchPage(data.info.next);
                    } else {
                        renderCharacters(allCharacters);
                    }
                })
                .catch(error => showError(error));
        }

        fetchPage(url);
    }

    function renderCharacters(characters) {
        const charactersContainer = document.getElementById('charactersContainer');
        charactersContainer.innerHTML = ''; // Clear previous results

        const table = document.createElement('table');
        table.innerHTML = `
            <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Especie</th>
                <th>Tipo</th>
                <th>Género</th>
            </tr>
        `;

        characters.forEach(character => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${character.name}</td>
                <td>${character.status}</td>
                <td>${character.species}</td>
                <td>${character.type || 'N/A'}</td>
                <td>${character.gender}</td>
            `;
            table.appendChild(row);
        });

        charactersContainer.appendChild(table);
    }

    function showError(error) {
        const charactersContainer = document.getElementById('charactersContainer');
        charactersContainer.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
});