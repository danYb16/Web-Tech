function initMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!menuToggle || !navLinks) {
    return;
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

async function loadResources() {
  const resourceList = document.getElementById("resource-list");
  const filteredList = document.getElementById("filtered-list");
  const filterInput = document.getElementById("filter-input");
  const tagList = document.getElementById("tag-list");

  if (!resourceList || !filteredList || !filterInput || !tagList) {
    return;
  }

  try {
    const response = await fetch("data/resources.json");
    if (!response.ok) {
      throw new Error("Nu s-au putut incarca datele.");
    }

    const resources = await response.json();

    resources.forEach((resource) => {
      const li = document.createElement("li");
      li.textContent = `${resource.name} (${resource.type}) - ${resource.location} | Program: ${resource.program}`;
      resourceList.appendChild(li);
    });

    const renderFiltered = (query) => {
      const normalizedQuery = query.trim().toLowerCase();
      filteredList.innerHTML = "";

      if (!normalizedQuery) {
        filteredList.innerHTML = "<li>Scrie un cuvant cheie pentru filtrare (ex: studiu).</li>";
        return;
      }

      const filteredResources = resources.filter((resource) => {
        const searchableText = [
          resource.name,
          resource.type,
          resource.location,
          resource.program,
          ...(resource.tags || [])
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedQuery);
      });

      if (filteredResources.length === 0) {
        filteredList.innerHTML = "<li>Nu exista rezultate pentru acest filtru.</li>";
        return;
      }

      filteredResources.forEach((resource) => {
        const li = document.createElement("li");
        li.textContent = `${resource.name} (${resource.type}) - ${resource.location}`;
        filteredList.appendChild(li);
      });
    };

    renderFiltered("");
    filterInput.addEventListener("input", (event) => {
      renderFiltered(event.target.value);
    });

    const allTags = [...new Set(resources.flatMap((resource) => resource.tags))];
    allTags.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = tag;
      tagList.appendChild(span);
    });
  } catch (error) {
    resourceList.innerHTML = `<li>Eroare: ${error.message}</li>`;
    filteredList.innerHTML = "";
    tagList.innerHTML = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  loadResources();
});