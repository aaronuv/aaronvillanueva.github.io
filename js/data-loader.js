// Data loader for all JSON data files

document.addEventListener('DOMContentLoaded', () => {
  // Load all data
  Promise.all([
    fetch('data/profile.json').then(res => res.json()),
    fetch('data/navigation.json').then(res => res.json()),
    fetch('data/about.json').then(res => res.json()),
    fetch('data/publications.json').then(res => res.json()),
    fetch('data/funding.json').then(res => res.json()),
    fetch('data/contact.json').then(res => res.json())
  ])
  .then(([profileData, navigationData, aboutData, publicationsData, fundingData, contactData]) => {
    // Load profile data (Sidebar and Mobile Header)
    loadProfileData(profileData);
    
    // Load navigation (Main Tabs)
    loadNavigation(navigationData); 
    
    // Load content sections
    loadAboutSection(aboutData);
    loadPublicationsSection(publicationsData);
    loadFundingSection(fundingData);
    loadContactSection(contactData);
    
    // Set footer
    loadFooter(profileData.footer);
    
    // Reinitialize tab navigation AFTER data and buttons are loaded
    if (typeof setupTabNavigation === 'function') {
      setupTabNavigation();
    }
  })
  .catch(error => {
    console.error('Error loading data:', error);
  });
  
  // Load profile data into sidebar and mobile header/menu
  function loadProfileData(data) {
    // Name and Title (Sidebar & Mobile Header)
    document.querySelectorAll('.sidebar .name, .mobile-profile .name').forEach(el => {
      el.textContent = data.name;
    });
    document.querySelectorAll('.sidebar .title, .mobile-profile .title').forEach(el => {
      el.textContent = data.title;
    });
    
// Avatar (Sidebar & Mobile Header)
document
  .querySelectorAll('.sidebar .avatar img, .mobile-profile img')
  .forEach(el => {
    el.src = 'assets/images/profile.jpeg';
    el.alt = data.name ? `${data.name}'s profile picture` : 'Profile picture';
  });
    
    // Contact info (Sidebar)
    const contactInfoContainerSidebar = document.querySelector('.sidebar .contact-info');
    if (contactInfoContainerSidebar) {
      contactInfoContainerSidebar.innerHTML = '';
      data.contactInfo.forEach(item => {
        const infoItem = document.createElement('div');
        infoItem.className = 'info-item';
        infoItem.innerHTML = `
          <i class="${item.icon}"></i>
          <span>${item.text}</span>
        `;
        contactInfoContainerSidebar.appendChild(infoItem);
      });
    }

    // Contact info (Mobile Menu)
    const contactInfoContainerMobileMenu = document.querySelector('.mobile-contact-info');
    if (contactInfoContainerMobileMenu) {
      contactInfoContainerMobileMenu.innerHTML = '';
      data.contactInfo.forEach(item => {
          const infoItem = document.createElement('div');
          infoItem.className = 'info-item mobile';
          infoItem.innerHTML = `
              <i class="${item.icon}"></i>
              <span>${item.text}</span>
          `;
          contactInfoContainerMobileMenu.appendChild(infoItem);
      });
    }

    // Contact info (Mobile Header)
    const contactInfoContainerMobileHeader = document.querySelector('.mobile-header-contact');
    if (contactInfoContainerMobileHeader) {
      contactInfoContainerMobileHeader.innerHTML = '';
      data.contactInfo.forEach(item => {
          const infoItem = document.createElement('div');
          infoItem.className = 'mobile-header-contact-item'; 
          infoItem.innerHTML = `<span>${item.text}</span>`; 
          contactInfoContainerMobileHeader.appendChild(infoItem);
      });
    }
    
    // Social links (Sidebar only)
    const socialLinksContainer = document.querySelector('.sidebar .social-links');
    if (socialLinksContainer) {
      socialLinksContainer.innerHTML = '';
      data.socialLinks.forEach(item => {
        const link = document.createElement('a');
        link.href = item.url;
        link.className = 'social-icon';
        link.target = '_blank';
        link.innerHTML = `<i class="${item.icon}"></i>`;
        link.setAttribute('aria-label', item.label);
        socialLinksContainer.appendChild(link);
      });
      const downloadLink = document.createElement('a');
      downloadLink.className = 'btn btn-primary social-icon';
      downloadLink.id = 'download-cv-btn';
      downloadLink.innerHTML = '<i class="fas fa-download"></i>';
      downloadLink.setAttribute('aria-label', 'Download CV');
      socialLinksContainer.appendChild(downloadLink);
    }
  }
  
  // Load main navigation tabs
  function loadNavigation(data) {
    const tabNavigation = document.querySelector('.tab-navigation');
    if (tabNavigation) {
      tabNavigation.innerHTML = '';
      const visibleTabs = data.tabs.filter(tab => !tab.hidden);
      visibleTabs.forEach(tab => {
        const button = document.createElement('button');
        button.className = 'tab-btn' + (tab.active ? ' active' : '');
        button.dataset.tab = tab.id;
        button.textContent = tab.title;
        tabNavigation.appendChild(button);
      });
    }
  }
  
  // Load about section
  function loadAboutSection(data) {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;
    
    const sectionHeader = aboutSection.querySelector('.section-header h2');
    if (sectionHeader) {
      sectionHeader.textContent = data.title;
    }
    
    const aboutText = aboutSection.querySelector('.about-text');
    if (aboutText) {
      aboutText.textContent = data.description;
    }
    
    const servicesGrid = aboutSection.querySelector('.services-grid');
    if (servicesGrid) {
      servicesGrid.innerHTML = '';
      
      data.services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.innerHTML = `
          <i class="${service.icon}"></i>
          <h4>${service.title}</h4>
          <p>${service.description}</p>
        `;
        servicesGrid.appendChild(serviceCard);
      });
    }
  }
  
  // Load publications section (single list)
  function loadPublicationsSection(data) {
    const publicationsSection = document.getElementById('publications');
    if (!publicationsSection) return;
    
    const sectionHeader = publicationsSection.querySelector('.section-header h2');
    if (sectionHeader) {
      sectionHeader.textContent = data.title;
    }
    
    const items = data.items || [];
    const timeline = publicationsSection.querySelector('.timeline');
    if (!timeline) return;
    
    timeline.innerHTML = '';
    items.forEach(item => {
      const timelineItem = document.createElement('div');
      timelineItem.className = 'timeline-item';
      const linkHtml = item.link 
        ? ` <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="publication-link"><i class="fas fa-external-link-alt"></i></a>`
        : '';
      timelineItem.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <h4>${item.title}${linkHtml}</h4>
          <p class="company">${item.authors}</p>
          <p class="period">${item.venue}</p>
        </div>
      `;
      timeline.appendChild(timelineItem);
    });
  }

  // Load funding section (single list, timeline layout)
  function loadFundingSection(data) {
    const fundingSection = document.getElementById('funding');
    if (!fundingSection) return;
    
    const sectionHeader = fundingSection.querySelector('.section-header h2');
    if (sectionHeader) {
      sectionHeader.textContent = data.title;
    }
    
    const items = data.items || [];
    const timeline = fundingSection.querySelector('.timeline');
    if (!timeline) return;
    
    timeline.innerHTML = '';
    items.forEach(item => {
      const timelineItem = document.createElement('div');
      timelineItem.className = 'timeline-item';
      const descriptionHtml = item.description ? `<p class="description">${item.description}</p>` : '';
      timelineItem.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <h4>${item.title}</h4>
          <p class="company">${item.organization}</p>
          <p class="period">${item.date}</p>
          ${descriptionHtml}
        </div>
      `;
      timeline.appendChild(timelineItem);
    });
  }
  
  // Load contact section
  function loadContactSection(data) {
    const contactSection = document.getElementById('contact');
    if (!contactSection) return;
    
    const sectionHeader = contactSection.querySelector('.section-header h2');
    if (sectionHeader) {
      sectionHeader.textContent = data.title;
    }
    
    const form = contactSection.querySelector('.contact-form');
    if (form) {
      form.innerHTML = '';
      
      data.form.fields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        
        const label = document.createElement('label');
        label.setAttribute('for', field.id);
        label.textContent = field.label;
        formGroup.appendChild(label);
        
        if (field.type === 'textarea') {
          const textarea = document.createElement('textarea');
          textarea.id = field.id;
          textarea.name = field.id;
          textarea.rows = field.rows || 5;
          if (field.required) textarea.required = true;
          formGroup.appendChild(textarea);
        } else {
          const input = document.createElement('input');
          input.type = field.type;
          input.id = field.id;
          input.name = field.id;
          if (field.required) input.required = true;
          formGroup.appendChild(input);
        }
        
        form.appendChild(formGroup);
      });
      
      const button = document.createElement('button');
      button.type = 'submit';
      button.className = 'submit-btn';
      button.textContent = data.form.submitButton;
      form.appendChild(button);
    }
    
    const mapContainer = contactSection.querySelector('.map-container');
    if (mapContainer && data.map.embedUrl) {
      mapContainer.innerHTML = `
        <iframe src="${data.map.embedUrl}" 
                style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      `;
    }
  }
  
  // Load footer
  function loadFooter(data) {
    const footer = document.querySelector('.footer');
    if (footer && data) {
      footer.innerHTML = `<p>${data.copyright}</p>`;
    }
  }
}); 

// Function to apply fade-in class to visible elements in a tab
function showTabContent(tabPane) {
  if (!tabPane) return;
  const elements = tabPane.querySelectorAll('.service-card, .timeline-item, .portfolio-item, .skill-item');
  elements.forEach(element => {
    element.classList.add('fade-in'); 
  });
}

// Setup tab navigation (for main tabs and mobile menu)
function setupTabNavigation() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  let initialActivePane = null;
  if (tabButtons.length > 0 && tabPanes.length > 0) {
    tabButtons.forEach((btn) => {
      if (btn.classList.contains('active')) {
        const targetId = btn.getAttribute('data-tab');
        initialActivePane = document.getElementById(targetId);
        if (initialActivePane) {
          initialActivePane.classList.add('active');
        } else {
          tabButtons[0].classList.add('active');
          tabPanes[0].classList.add('active');
          initialActivePane = tabPanes[0];
        }
      }
    });
    if (!initialActivePane && tabPanes.length > 0) {
      tabButtons[0].classList.add('active');
      tabPanes[0].classList.add('active');
      initialActivePane = tabPanes[0];
    }
  }

  if (initialActivePane) {
    showTabContent(initialActivePane);
  }
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-tab');
      
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));
      
      button.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
        showTabContent(targetPane);
      }
    });
  });
}
