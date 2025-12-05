const categoryNames = {
  marketing: 'Marketing',
  management: 'Management',
  hr: 'HR & Recruiting',
  design: 'Design',
  development: 'Development'
};

const categoryThemes = {
  marketing: 'marketing',
  management: 'management',
  hr: 'hr',
  design: 'design',
  development: 'development'
};

let currentCategory = 'all';
let currentSearchQuery = '';
let coursesToShow = 9; 

const courseGrid = document.getElementById('courseGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.page__filters-button');
const dropdownToggle = document.getElementById('dropdownToggle');
const dropdownMenu = document.getElementById('dropdownMenu');
const dropdownText = document.getElementById('dropdownText');
const dropdownOptions = document.querySelectorAll('.page__filters-dropdown-option');
const dropdown = document.querySelector('.page__filters-dropdown');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loadMoreContainer = document.querySelector('.page__load-more');



function createCourseCard(course) {
  const card = document.createElement('div');
  card.className = 'course-card';
  
  const categoryName = categoryNames[course.category] || course.category;
  const categoryTheme = categoryThemes[course.category] || course.category;
  
  card.innerHTML = `
    <div class="course-card__image-wrapper">
      <img src="${course.image}" alt="${course.instructor}" class="course-card__image">
    </div>
    <div class="course-card__content">
      <span class="course-card__category course-card__category_theme_${categoryTheme}">
        ${categoryName}
      </span>
      <h3 class="course-card__title">${course.title}</h3>
      <div class="course-card__price-author">
        <p class="course-card__price">$${course.price}</p>
        <p class="course-card__author">by ${course.instructor}</p>
      </div>
    </div>
  `;
  
  return card;
}

function renderCourses(coursesToRender) {
  courseGrid.innerHTML = '';
  
  if (coursesToRender.length === 0) {
    courseGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #9A9CA5;">No courses found</p>';
    if (loadMoreContainer) {
      loadMoreContainer.style.display = 'none';
    }
    return;
  }
  
  const coursesToDisplay = coursesToRender.slice(0, coursesToShow);
  
  coursesToDisplay.forEach(course => {
    const card = createCourseCard(course);
    courseGrid.appendChild(card);
  });
  
  if (loadMoreContainer) {
    if (coursesToRender.length > coursesToShow) {
      loadMoreContainer.style.display = 'block';
    } else {
      loadMoreContainer.style.display = 'none';
    }
  }
}

function filterByCategory(coursesList, category) {
  if (category === 'all') {
    return coursesList;
  }
  return coursesList.filter(course => course.category === category);
}

function filterBySearch(coursesList, query) {
  if (!query.trim()) {
    return coursesList;
  }
  const lowerQuery = query.toLowerCase();
  return coursesList.filter(course => 
    course.title.toLowerCase().includes(lowerQuery)
  );
}

function applyFilters() {
  let filtered = courses;
  
  filtered = filterByCategory(filtered, currentCategory);
  
  filtered = filterBySearch(filtered, currentSearchQuery);
  
  renderCourses(filtered);
  
  updateCounters(courses);
}

function countCoursesByCategory(coursesList) {
  const counts = {
    all: coursesList.length,
    marketing: 0,
    management: 0,
    hr: 0,
    design: 0,
    development: 0
  };
  
  coursesList.forEach(course => {
    if (counts.hasOwnProperty(course.category)) {
      counts[course.category]++;
    }
  });
  
  return counts;
}

function updateCounters(filteredCourses) {
  const counts = countCoursesByCategory(filteredCourses);
  
  filterButtons.forEach(button => {
    const category = button.getAttribute('data-category');
    
    if (counts.hasOwnProperty(category)) {
      button.setAttribute('data-count', counts[category]);
    }
  });
  
  if (dropdownOptions) {
    dropdownOptions.forEach(option => {
      const category = option.getAttribute('data-category');
      const countElement = option.querySelector('.page__filters-dropdown-option-count');
      if (counts.hasOwnProperty(category) && countElement) {
        countElement.textContent = counts[category];
        option.setAttribute('data-count', counts[category]);
      }
    });
  }
}

function handleCategoryClick(event) {
  const button = event.currentTarget;
  const category = button.getAttribute('data-category');
  
  filterButtons.forEach(btn => {
    btn.classList.remove('page__filters-button_active');
  });
  button.classList.add('page__filters-button_active');
  
  dropdownOptions.forEach(opt => {
    opt.classList.remove('page__filters-dropdown-option_active');
  });
  const dropdownOption = document.querySelector(`.page__filters-dropdown-option[data-category="${category}"]`);
  if (dropdownOption) {
    dropdownOption.classList.add('page__filters-dropdown-option_active');
  }
  
  const categoryName = categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
  if (category === 'all') {
    dropdownText.textContent = 'All';
  } else {
    dropdownText.textContent = categoryName;
  }
  
  if (dropdown) {
    dropdown.classList.remove('page__filters-dropdown_active');
  }
  
  currentCategory = category;
  resetCoursesToShow();
  applyFilters();
}

function handleDropdownOptionClick(event) {
  const button = event.currentTarget;
  const category = button.getAttribute('data-category');
  
  dropdownOptions.forEach(opt => {
    opt.classList.remove('page__filters-dropdown-option_active');
  });
  button.classList.add('page__filters-dropdown-option_active');
  
  filterButtons.forEach(btn => {
    btn.classList.remove('page__filters-button_active');
    if (btn.getAttribute('data-category') === category) {
      btn.classList.add('page__filters-button_active');
    }
  });
  
  const categoryName = categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
  if (category === 'all') {
    dropdownText.textContent = 'All';
  } else {
    dropdownText.textContent = categoryName;
  }
  
  if (dropdown) {
    dropdown.classList.remove('page__filters-dropdown_active');
  }
  
  currentCategory = category;
  resetCoursesToShow();
  applyFilters();
}

function handleDropdownToggle() {
  if (dropdown) {
    dropdown.classList.toggle('page__filters-dropdown_active');
  }
}

document.addEventListener('click', (event) => {
  if (dropdown && !dropdown.contains(event.target)) {
    dropdown.classList.remove('page__filters-dropdown_active');
  }
});

function handleLoadMore() {
  coursesToShow += 6;
  applyFilters();
}

function resetCoursesToShow() {
  coursesToShow = 6;
}

function handleSearchInput(event) {
  currentSearchQuery = event.target.value;
  resetCoursesToShow();
  applyFilters();
}

function init() {
  filterButtons.forEach(button => {
    button.addEventListener('click', handleCategoryClick);
  });
  
  if (dropdownOptions) {
    dropdownOptions.forEach(option => {
      option.addEventListener('click', handleDropdownOptionClick);
    });
  }
  
  if (dropdownToggle) {
    dropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      handleDropdownToggle();
    });
  }
  
  searchInput.addEventListener('input', handleSearchInput);
  
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', handleLoadMore);
  }
  
  applyFilters();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
