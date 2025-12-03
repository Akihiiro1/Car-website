document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const makeSelect = document.getElementById('make');
  const modelSelect = document.getElementById('model');
  const yearSelect = document.getElementById('year');

  const vehicleData = {
    bmw: {
      models: ['3 Series', '5 Series', '7 Series', 'X5', 'M3', 'M5', 'X7', 'i4', 'iX'],
      years: ['2025', '2024', '2023', '2022', '2021']
    },
    mercedes: {
      models: ['C-Class', 'E-Class', 'S-Class', 'GLE', 'AMG GT', 'EQS'],
      years: ['2025', '2024', '2023', '2022', '2021']
    },
    audi: {
      models: ['A4', 'A6', 'A8', 'Q5', 'Q7', 'RS6', 'e-tron'],
      years: ['2025', '2024', '2023', '2022', '2021']
    },
    porsche: {
      models: ['911', 'Cayenne', 'Panamera', 'Taycan', 'Macan'],
      years: ['2025', '2024', '2023', '2022', '2021']
    }
  };

  if (searchButton && searchInput) {
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch();
    });
  }

  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const parts = document.querySelectorAll('.part-item');
    
    parts.forEach(part => {
      const title = part.querySelector('h3').textContent.toLowerCase();
      const description = part.querySelector('p').textContent.toLowerCase();
      
      if (title.includes(searchTerm) || description.includes(searchTerm)) {
        part.style.display = 'flex';
        part.style.animation = 'fadeIn 0.3s ease forwards';
      } else {
        part.style.display = 'none';
      }
    });
  }

  if (makeSelect && modelSelect && yearSelect) {
    makeSelect.addEventListener('change', (e) => {
      const make = e.target.value;
      updateModelDropdown(make);
    });

    modelSelect.addEventListener('change', () => {
      updateYearDropdown();
    });

    yearSelect.addEventListener('change', () => {
      const make = makeSelect.value;
      const model = modelSelect.value;
      const year = yearSelect.value;
      showVehicleInfo(make, model, year);
    });
  }

  function updateModelDropdown(make) {
    modelSelect.innerHTML = '<option value="">Select Model</option>';
    modelSelect.disabled = !make;
    yearSelect.innerHTML = '<option value="">Select Year</option>';
    yearSelect.disabled = true;

    if (make && vehicleData[make]) {
      vehicleData[make].models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.toLowerCase().replace(/\s+/g, '-');
        option.textContent = model;
        modelSelect.appendChild(option);
      });
    }
  }

  function updateYearDropdown() {
    const make = makeSelect.value;
    yearSelect.innerHTML = '<option value="">Select Year</option>';
    yearSelect.disabled = !modelSelect.value;

    if (make && vehicleData[make]) {
      vehicleData[make].years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
      });
    }
  }

  function showVehicleInfo(make, model, year) {
    alert(`Selected vehicle: ${year} ${make} ${model}\nLoading maintenance information...`);
  }
});