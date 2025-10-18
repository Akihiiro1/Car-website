document.addEventListener('DOMContentLoaded', function() {
  initializeVehicleSelection();
});

function initializeVehicleSelection() {
  const makeDropdown = document.getElementById('make-dropdown');
  const modelDropdown = document.getElementById('model-dropdown');
  const yearDropdown = document.getElementById('year-dropdown');
  const vehicleCards = document.querySelectorAll('.vehicle-card');
  
  if (!makeDropdown || !modelDropdown || !yearDropdown) return;
  
  const vehicleData = {
    'bmw': {
      models: ['3 Series', '5 Series', '7 Series', 'X5', 'M3', 'M5'],
      years: ['2025', '2024', '2023', '2022', '2021', '2020']
    },
    'bugatti': {
      models: ['Chiron', 'Veyron', 'Divo', 'La Voiture Noire'],
      years: ['2025', '2024', '2023', '2022', '2021']
    },
    'rolls-royce': {
      models: ['Phantom', 'Ghost', 'Wraith', 'Cullinan'],
      years: ['2025', '2024', '2023', '2022', '2021', '2020']
    },
    'lamborghini': {
      models: ['Aventador', 'Huracan', 'Urus', 'Revuelto'],
      years: ['2025', '2024', '2023', '2022', '2021']
    },
    'nissan': {
      models: ['GT-R', '370Z', 'Maxima', 'Altima'],
      years: ['2025', '2024', '2023', '2022', '2021', '2020']
    },
    'mazda': {
      models: ['MX-5', 'RX-7', 'RX-8', 'Mazda3'],
      years: ['2025', '2024', '2023', '2022', '2021', '2020']
    },
    'toyota': {
      models: ['Supra', '86', 'Camry', 'Corolla'],
      years: ['2025', '2024', '2023', '2022', '2021', '2020']
    },
    'pagani': {
      models: ['Huayra', 'Zonda', 'Utopia'],
      years: ['2025', '2024', '2023', '2022', '2021']
    }
  };
  
  makeDropdown.addEventListener('change', function() {
    const selectedMake = this.value;
    
    resetDropdown(modelDropdown, 'Select Model');
    modelDropdown.disabled = false;
    
    resetDropdown(yearDropdown, 'Select Year');
    yearDropdown.disabled = true;

    if (vehicleData[selectedMake]) {
      populateDropdown(modelDropdown, vehicleData[selectedMake].models);
    }
    
    highlightSelectedCard(selectedMake);
  });
  
  modelDropdown.addEventListener('change', function() {
 
    yearDropdown.disabled = false;
    resetDropdown(yearDropdown, 'Select Year');
    
    const selectedMake = makeDropdown.value;
    
    if (vehicleData[selectedMake]) {
      populateDropdown(yearDropdown, vehicleData[selectedMake].years);
    }
  });
  
  yearDropdown.addEventListener('change', function() {
    const selectedMake = makeDropdown.value;
    const selectedModel = modelDropdown.value;
    const selectedYear = this.value;
    
    console.log(`Selected vehicle: ${selectedYear} ${selectedMake} ${selectedModel}`);
    
    setTimeout(() => {
      alert(`You selected: ${selectedYear} ${selectedMake} ${selectedModel}`);
    }, 500);
  });
  
  vehicleCards.forEach(card => {
    card.addEventListener('click', function() {
      const make = this.getAttribute('data-make');
      makeDropdown.value = make;
      
      const event = new Event('change');
      makeDropdown.dispatchEvent(event);
      
      makeDropdown.scrollIntoView({ behavior: 'smooth' });
    });
  });
  
  function resetDropdown(dropdown, placeholder) {
    dropdown.innerHTML = '';
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = placeholder;
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    dropdown.appendChild(placeholderOption);
  }
  
  function populateDropdown(dropdown, options) {
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.toLowerCase().replace(' ', '-');
      optionElement.textContent = option;
      dropdown.appendChild(optionElement);
    });
  }
  
  function highlightSelectedCard(make) {
    vehicleCards.forEach(card => {
      if (card.getAttribute('data-make') === make) {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.4)';
        card.style.border = `2px solid ${getComputedStyle(document.documentElement).getPropertyValue('--accent-color')}`;
      } else {
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.border = '';
      }
    });
  }
}